from app.db import Base, get_database_engine
from app.models import User, UserSession


def main() -> None:
    engine = get_database_engine()
    Base.metadata.create_all(engine)
    print(f"Database tables initialized: {User.__tablename__}, {UserSession.__tablename__}")


if __name__ == "__main__":
    main()
