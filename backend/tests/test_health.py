from fastapi.testclient import TestClient

from app.core.config import get_settings
from app.main import app

client = TestClient(app)


def test_health_check_reports_api_liveness() -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_readiness_reports_missing_database_configuration(
    monkeypatch,
) -> None:
    monkeypatch.delenv("URDUTRUTH_DATABASE_URL", raising=False)
    get_settings.cache_clear()

    try:
        response = client.get("/api/v1/health/ready")
    finally:
        get_settings.cache_clear()

    assert response.status_code == 503
    assert response.json() == {"detail": "Database is not configured"}
