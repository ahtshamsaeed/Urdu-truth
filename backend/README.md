# UrduTruth backend

The backend is a Python 3.12+ FastAPI service. It provides API health checks
and email-or-phone/password account authentication. Prediction, fact-check
history, and model inference will be added in later steps.

## Local setup

From the repository root, install the backend dependencies into the project's
Python environment:

```powershell
.\.venv\Scripts\python.exe -m pip install -r .\backend\requirements.txt
Copy-Item .\backend\.env.example .\backend\.env
```

Set `URDUTRUTH_DATABASE_URL` in `backend/.env` to the PostgreSQL connection
string for your local database. Do not commit `.env` or real credentials.
Set `URDUTRUTH_SESSION_COOKIE_SECURE=true` when serving over HTTPS in
production. Keep the frontend API URL set to `http://localhost:8000/api/v1`
for local development; deployments should configure
`NEXT_PUBLIC_URDUTRUTH_API_URL` to the deployed API base URL.

Create the initial PostgreSQL tables before starting the API:

```powershell
Set-Location .\backend
..\.venv\Scripts\python.exe -m app.init_db
```

Run the API from the backend directory:

```powershell
Set-Location .\backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

The service exposes:

- `GET /api/v1/health` — API liveness.
- `GET /api/v1/health/ready` — database readiness; returns `503` if PostgreSQL
  is not configured or cannot be reached.
- `POST /api/v1/auth/signup` — create an email- or phone-based account and
  start a session.
- `POST /api/v1/auth/login` — authenticate and start a session.
- `GET /api/v1/auth/me` — return the signed-in account for the session cookie.
- `POST /api/v1/auth/logout` — revoke the active session.
- `/docs` — interactive API documentation.

Account data is stored in the `users` table and hashed session credentials in
`user_sessions`. Passwords are hashed with Python's standard-library scrypt
implementation; raw passwords and session tokens are not stored. Email/phone
verification, password recovery, and Google OAuth are not enabled because no
verification or OAuth provider has been configured.

Run the backend tests from the backend directory with
`..\.venv\Scripts\python.exe -m pytest`.
