from functools import lru_cache
from collections.abc import Generator

from fastapi import HTTPException
from sqlalchemy import Engine, create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import get_settings


class Base(DeclarativeBase):
    pass


@lru_cache
def get_database_engine() -> Engine:
    database_url = get_settings().database_url
    if not database_url:
        raise ValueError("URDUTRUTH_DATABASE_URL is not configured")

    return create_engine(database_url, pool_pre_ping=True)


def get_db_session() -> Generator[Session, None, None]:
    try:
        engine = get_database_engine()
    except ValueError as exc:
        raise HTTPException(
            status_code=503,
            detail="Database is not configured",
        ) from exc

    session_factory = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    with session_factory() as session:
        try:
            session.execute(text("SELECT 1"))
        except SQLAlchemyError as exc:
            raise HTTPException(
                status_code=503,
                detail="Database connection failed",
            ) from exc
        yield session
