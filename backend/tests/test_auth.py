from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import sessionmaker

from app.models import User, UserSession
from app.services.auth import verify_password


def signup_payload(**updates: object) -> dict[str, object]:
    payload: dict[str, object] = {
        "full_name": "  Ayesha   Khan ",
        "email": "AYESHA@example.com",
        "password": "correct-horse-123",
        "confirm_password": "correct-horse-123",
        "terms_accepted": True,
    }
    payload.update(updates)
    return payload


def test_email_signup_creates_user_and_authenticated_session(test_client) -> None:
    response = test_client.post("/api/v1/auth/signup", json=signup_payload())

    assert response.status_code == 201
    assert response.json()["full_name"] == "Ayesha Khan"
    assert response.json()["email"] == "ayesha@example.com"
    assert "password_hash" not in response.json()
    cookie = response.headers["set-cookie"]
    assert "urdutruth_session=" in cookie
    assert "httponly" in cookie.lower()

    current_user = test_client.get("/api/v1/auth/me")
    assert current_user.status_code == 200
    assert current_user.json()["id"] == response.json()["id"]


def test_phone_signup_normalizes_phone_and_authenticates(test_client) -> None:
    payload = signup_payload(
        email=None,
        phone="+92 (300) 123-4567",
    )

    signup = test_client.post("/api/v1/auth/signup", json=payload)
    assert signup.status_code == 201
    assert signup.json()["phone"] == "+923001234567"
    assert signup.json()["email"] is None

    test_client.post("/api/v1/auth/logout")
    login = test_client.post(
        "/api/v1/auth/login",
        json={"identifier": "+92 300 1234567", "password": "correct-horse-123"},
    )
    assert login.status_code == 200
    assert login.json()["id"] == signup.json()["id"]


def test_signup_rejects_mismatched_passwords(test_client) -> None:
    response = test_client.post(
        "/api/v1/auth/signup",
        json=signup_payload(confirm_password="a-different-password"),
    )

    assert response.status_code == 422
    assert "Passwords do not match" in str(response.json())


def test_signup_rejects_unaccepted_terms(test_client) -> None:
    response = test_client.post(
        "/api/v1/auth/signup",
        json=signup_payload(terms_accepted=False),
    )

    assert response.status_code == 422
    assert "accept the Terms" in str(response.json())


def test_signup_requires_exactly_one_contact_method(test_client) -> None:
    response = test_client.post(
        "/api/v1/auth/signup",
        json=signup_payload(phone="+923001234567"),
    )

    assert response.status_code == 422
    assert "either an email address or a phone number" in str(response.json())


def test_duplicate_signup_returns_conflict(test_client) -> None:
    first = test_client.post("/api/v1/auth/signup", json=signup_payload())
    second = test_client.post("/api/v1/auth/signup", json=signup_payload())

    assert first.status_code == 201
    assert second.status_code == 409


def test_login_rejects_invalid_credentials_without_revealing_account(
    test_client,
) -> None:
    response = test_client.post(
        "/api/v1/auth/login",
        json={"identifier": "missing@example.com", "password": "wrong-password"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email, phone number, or password"


def test_login_rejects_wrong_password_for_existing_account(test_client) -> None:
    signup = test_client.post("/api/v1/auth/signup", json=signup_payload())
    test_client.post("/api/v1/auth/logout")

    response = test_client.post(
        "/api/v1/auth/login",
        json={"identifier": "ayesha@example.com", "password": "wrong-password"},
    )

    assert signup.status_code == 201
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email, phone number, or password"


def test_login_with_email_sets_remembered_session(test_client) -> None:
    signup = test_client.post("/api/v1/auth/signup", json=signup_payload())
    test_client.post("/api/v1/auth/logout")

    login = test_client.post(
        "/api/v1/auth/login",
        json={
            "identifier": "AYESHA@example.com",
            "password": "correct-horse-123",
            "remember_me": True,
        },
    )

    assert login.status_code == 200
    assert login.json()["id"] == signup.json()["id"]
    assert "Max-Age=2592000" in login.headers["set-cookie"]


def test_logout_revokes_session_and_removes_cookie(test_client) -> None:
    signup = test_client.post("/api/v1/auth/signup", json=signup_payload())
    assert signup.status_code == 201

    logout = test_client.post("/api/v1/auth/logout")
    assert logout.status_code == 204
    assert "urdutruth_session=" in logout.headers["set-cookie"]

    protected = test_client.get("/api/v1/auth/me")
    assert protected.status_code == 401


def test_current_user_rejects_a_tampered_session_cookie(test_client) -> None:
    signup = test_client.post("/api/v1/auth/signup", json=signup_payload())
    assert signup.status_code == 201

    test_client.cookies.set("urdutruth_session", "tampered-session-token")
    response = test_client.get("/api/v1/auth/me")

    assert response.status_code == 401


def test_signup_stores_only_a_password_hash(test_client, database_engine) -> None:
    response = test_client.post("/api/v1/auth/signup", json=signup_payload())
    session_factory = sessionmaker(bind=database_engine)
    with session_factory() as db:
        user = db.get(User, UUID(response.json()["id"]))
        assert user is not None
        assert user.password_hash != "correct-horse-123"
        assert verify_password("correct-horse-123", user.password_hash)
        assert db.scalar(select(UserSession)) is not None
