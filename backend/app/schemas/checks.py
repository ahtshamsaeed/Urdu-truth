from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class FactCheckResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    claim_text: str
    image_mime: str | None
    image_name: str | None
    status: Literal["awaiting_model", "complete"]
    created_at: datetime
