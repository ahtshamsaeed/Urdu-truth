from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, UploadFile, status

from app.api.auth import DatabaseSession, current_user
from app.models.user import User
from app.schemas.checks import FactCheckResponse
from app.services.checks import create_fact_check, get_fact_check

router = APIRouter(prefix="/checks", tags=["fact checks"])


@router.post(
    "",
    response_model=FactCheckResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def submit_fact_check(
    user: Annotated[User, Depends(current_user)],
    db: DatabaseSession,
    claim_text: Annotated[str, Form(max_length=10_000)] = "",
    image: Annotated[UploadFile | None, File()] = None,
) -> FactCheckResponse:
    fact_check = await create_fact_check(claim_text, image, user, db)
    return FactCheckResponse.model_validate(fact_check)


@router.get("/{check_id}", response_model=FactCheckResponse)
def read_fact_check(
    check_id: UUID,
    user: Annotated[User, Depends(current_user)],
    db: DatabaseSession,
) -> FactCheckResponse:
    fact_check = get_fact_check(check_id, user, db)
    return FactCheckResponse.model_validate(fact_check)
