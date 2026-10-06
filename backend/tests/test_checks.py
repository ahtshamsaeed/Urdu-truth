from io import BytesIO
from uuid import uuid4

from PIL import Image
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import FactCheck


def signup_payload(email: str) -> dict[str, object]:
    return {
        "full_name": "Fact Checker",
        "email": email,
        "password": "correct-horse-123",
        "confirm_password": "correct-horse-123",
        "terms_accepted": True,
    }


def create_test_png() -> bytes:
    buffer = BytesIO()
    Image.new("RGB", (12, 8), color="cyan").save(buffer, format="PNG")
    return buffer.getvalue()


def test_fact_check_submission_is_saved_without_fabricating_prediction(
    test_client,
    database_engine,
) -> None:
    signup = test_client.post(
        "/api/v1/auth/signup",
        json=signup_payload("checker@example.com"),
    )
    assert signup.status_code == 201

    response = test_client.post(
        "/api/v1/checks",
        data={"claim_text": "  یہ ایک دعویٰ ہے  "},
    )

    assert response.status_code == 202
    assert response.json()["claim_text"] == "یہ ایک دعویٰ ہے"
    assert response.json()["status"] == "awaiting_model"
    assert "result" not in response.json()
    with Session(database_engine) as db:
        saved = db.scalar(select(FactCheck))
        assert saved is not None
        assert saved.user_id == signup.json()["id"] or str(saved.user_id) == signup.json()["id"]
        assert saved.claim_text == "یہ ایک دعویٰ ہے"
        assert saved.image_data is None


def test_fact_check_submission_saves_valid_image(test_client, database_engine) -> None:
    test_client.post(
        "/api/v1/auth/signup",
        json=signup_payload("image-checker@example.com"),
    )

    response = test_client.post(
        "/api/v1/checks",
        data={"claim_text": "A claim with a screenshot"},
        files={"image": ("claim.png", create_test_png(), "image/png")},
    )

    assert response.status_code == 202
    assert response.json()["image_mime"] == "PNG"
    with Session(database_engine) as db:
        saved = db.scalar(select(FactCheck))
        assert saved is not None
        assert saved.image_data == create_test_png()


def test_fact_check_requires_text_or_image(test_client) -> None:
    test_client.post(
        "/api/v1/auth/signup",
        json=signup_payload("empty-checker@example.com"),
    )

    response = test_client.post("/api/v1/checks")

    assert response.status_code == 422
    assert response.json()["detail"] == "Add claim text or upload an image"


def test_fact_check_rejects_mismatched_image_content_type(test_client) -> None:
    test_client.post(
        "/api/v1/auth/signup",
        json=signup_payload("invalid-image-checker@example.com"),
    )

    response = test_client.post(
        "/api/v1/checks",
        files={"image": ("claim.png", b"not an image", "image/png")},
    )

    assert response.status_code == 422
    assert response.json()["detail"] == "The uploaded file is not a valid image"


def test_fact_check_rejects_unsupported_image_type(test_client) -> None:
    test_client.post(
        "/api/v1/auth/signup",
        json=signup_payload("unsupported-image-checker@example.com"),
    )

    response = test_client.post(
        "/api/v1/checks",
        files={"image": ("claim.gif", b"GIF89a", "image/gif")},
    )

    assert response.status_code == 415


def test_fact_check_requires_authenticated_user(test_client) -> None:
    response = test_client.post(
        "/api/v1/checks",
        data={"claim_text": "A claim"},
    )

    assert response.status_code == 401


def test_fact_check_is_only_readable_by_owning_user(test_client) -> None:
    test_client.post(
        "/api/v1/auth/signup",
        json=signup_payload("owner@example.com"),
    )
    created = test_client.post(
        "/api/v1/checks",
        data={"claim_text": "Private claim"},
    )
    assert created.status_code == 202

    test_client.post("/api/v1/auth/logout")
    test_client.post(
        "/api/v1/auth/signup",
        json=signup_payload("different-user@example.com"),
    )
    response = test_client.get(f"/api/v1/checks/{created.json()['id']}")

    assert response.status_code == 404


def test_unknown_fact_check_returns_not_found(test_client) -> None:
    test_client.post(
        "/api/v1/auth/signup",
        json=signup_payload("lookup@example.com"),
    )

    response = test_client.get(f"/api/v1/checks/{uuid4()}")

    assert response.status_code == 404
