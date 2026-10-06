from functools import lru_cache
from collections.abc import Generator

from sqlalchemy import Engine, create_engine
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
    session_factory = sessionmaker(
        bind=get_database_engine(),
        autoflush=False,
        autocommit=False,
    )
    with session_factory() as session:
        yield session
