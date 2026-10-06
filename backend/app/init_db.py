from app.db import Base, get_database_engine
from app.models import FactCheck, User, UserSession


def main() -> None:
    engine = get_database_engine()
    Base.metadata.create_all(engine)
    table_names = ", ".join(
        model.__tablename__ for model in (User, UserSession, FactCheck)
    )
    print(f"Database tables initialized: {table_names}")


if __name__ == "__main__":
    main()
