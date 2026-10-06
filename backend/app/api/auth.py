from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db import get_db_session
from app.models.user import User
from app.schemas.auth import LoginRequest, SignupRequest, UserResponse
from app.services.auth import (
    authenticate_user,
    create_user,
    get_session_user,
    issue_session,
    revoke_session,
)

router = APIRouter(prefix="/auth", tags=["authentication"])
DatabaseSession = Annotated[Session, Depends(get_db_session)]


def current_user(
    db: DatabaseSession,
    session_token: Annotated[
        str | None,
        Cookie(alias=get_settings().session_cookie_name),
    ] = None,
) -> User:
    return get_session_user(session_token, db)


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(
    payload: SignupRequest,
    response: Response,
    db: DatabaseSession,
) -> User:
    user = create_user(payload, db)
    issue_session(user, db, response, remember_me=True)
    return user


@router.post("/login", response_model=UserResponse)
def login(
    payload: LoginRequest,
    response: Response,
    db: DatabaseSession,
) -> User:
    return authenticate_user(payload, db, response)


@router.get("/me", response_model=UserResponse)
def read_current_user(user: Annotated[User, Depends(current_user)]) -> User:
    return user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    db: DatabaseSession,
    session_token: Annotated[
        str | None,
        Cookie(alias=get_settings().session_cookie_name),
    ] = None,
) -> Response:
    revoke_session(session_token, db, response)
    response.status_code = status.HTTP_204_NO_CONTENT
    return response
