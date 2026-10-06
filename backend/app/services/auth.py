import hashlib
import hmac
import secrets
from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.user import User, UserSession
from app.schemas.auth import LoginRequest, SignupRequest

PASSWORD_SCRYPT_N = 2**14
PASSWORD_SCRYPT_R = 8
PASSWORD_SCRYPT_P = 1
PASSWORD_SALT_BYTES = 16
PASSWORD_KEY_BYTES = 64
DEFAULT_SESSION_LIFETIME = timedelta(hours=12)
REMEMBERED_SESSION_LIFETIME = timedelta(days=30)


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(PASSWORD_SALT_BYTES)
    digest = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt,
        n=PASSWORD_SCRYPT_N,
        r=PASSWORD_SCRYPT_R,
        p=PASSWORD_SCRYPT_P,
        dklen=PASSWORD_KEY_BYTES,
    )
    return (
        f"scrypt${PASSWORD_SCRYPT_N}${PASSWORD_SCRYPT_R}${PASSWORD_SCRYPT_P}"
        f"${salt.hex()}${digest.hex()}"
    )


def verify_password(password: str, encoded_hash: str) -> bool:
    try:
        algorithm, n, r, p, salt_hex, expected_hex = encoded_hash.split("$")
        if algorithm != "scrypt":
            return False
        if (
            int(n) != PASSWORD_SCRYPT_N
            or int(r) != PASSWORD_SCRYPT_R
            or int(p) != PASSWORD_SCRYPT_P
        ):
            return False
        salt = bytes.fromhex(salt_hex)
        expected = bytes.fromhex(expected_hex)
        if len(salt) != PASSWORD_SALT_BYTES or len(expected) != PASSWORD_KEY_BYTES:
            return False
        actual = hashlib.scrypt(
            password.encode("utf-8"),
            salt=salt,
            n=int(n),
            r=int(r),
            p=int(p),
            dklen=len(expected),
        )
    except (ValueError, TypeError):
        return False
    return hmac.compare_digest(actual, expected)


def create_user(payload: SignupRequest, db: Session) -> User:
    filters = []
    if payload.email:
        filters.append(User.email == payload.email)
    if payload.phone:
        filters.append(User.phone == payload.phone)
    existing_user = db.scalar(select(User).where(*filters))
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with those details already exists",
        )

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    try:
        db.flush()
        db.refresh(user)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with those details already exists",
        ) from exc
    return user


def _normalize_identifier(identifier: str) -> tuple[str, str] | None:
    value = identifier.strip()
    if "@" in value:
        normalized_email = value.lower()
        if not normalized_email or len(normalized_email) > 254:
            return None
        return "email", normalized_email

    if not value or any(not (character.isdigit() or character in "+ ().-") for character in value):
        return None
    digits = "".join(character for character in value if character.isdigit())
    if not 7 <= len(digits) <= 15:
        return None
    normalized_phone = f"+{digits}" if value.startswith("+") else digits
    return "phone", normalized_phone


def issue_session(
    user: User,
    db: Session,
    response: Response,
    remember_me: bool,
) -> None:
    lifetime = (
        REMEMBERED_SESSION_LIFETIME if remember_me else DEFAULT_SESSION_LIFETIME
    )
    raw_token = secrets.token_urlsafe(32)
    now = datetime.now(UTC)
    session = UserSession(
        user_id=user.id,
        token_hash=hashlib.sha256(raw_token.encode("utf-8")).hexdigest(),
        expires_at=now + lifetime,
    )
    db.add(session)
    db.commit()

    settings = get_settings()
    response.set_cookie(
        key=settings.session_cookie_name,
        value=raw_token,
        max_age=int(lifetime.total_seconds()),
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite=settings.session_cookie_samesite,
        path="/",
    )


def authenticate_user(
    payload: LoginRequest,
    db: Session,
    response: Response,
) -> User:
    normalized = _normalize_identifier(payload.identifier)
    user: User | None = None
    if normalized is not None:
        field, value = normalized
        user = db.scalar(select(User).where(getattr(User, field) == value))

    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email, phone number, or password",
            headers={"WWW-Authenticate": "Cookie"},
        )

    issue_session(user, db, response, payload.remember_me)
    return user


def get_session_user(raw_token: str | None, db: Session) -> User:
    if not raw_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    user_session = db.scalar(
        select(UserSession).where(
            UserSession.token_hash == token_hash,
            UserSession.revoked_at.is_(None),
        )
    )
    now = datetime.now(UTC)
    if user_session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    expires_at = user_session.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)
    if expires_at <= now:
        user_session.revoked_at = now
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired",
        )

    user = db.get(User, user_session.user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    return user


def revoke_session(raw_token: str | None, db: Session, response: Response) -> None:
    if raw_token:
        token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
        user_session = db.scalar(
            select(UserSession).where(
                UserSession.token_hash == token_hash,
                UserSession.revoked_at.is_(None),
            )
        )
        if user_session is not None:
            user_session.revoked_at = datetime.now(UTC)
            db.commit()

    settings = get_settings()
    response.delete_cookie(
        key=settings.session_cookie_name,
        path="/",
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite=settings.session_cookie_samesite,
    )
