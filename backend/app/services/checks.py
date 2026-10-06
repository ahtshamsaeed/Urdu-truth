from io import BytesIO
from uuid import UUID

from fastapi import HTTPException, UploadFile, status
from PIL import Image, UnidentifiedImageError
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.user import FactCheck, User

MAX_IMAGE_BYTES = 10 * 1024 * 1024
MAX_IMAGE_PIXELS = 20_000_000
ALLOWED_IMAGE_TYPES = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WEBP",
}
MAX_CLAIM_CHARACTERS = 10_000


def _validate_image(image_data: bytes, content_type: str | None) -> str:
    expected_format = ALLOWED_IMAGE_TYPES.get(content_type or "")
    if expected_format is None:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Upload a PNG, JPEG, or WEBP image",
        )

    try:
        with Image.open(BytesIO(image_data)) as image:
            if image.format != expected_format:
                raise HTTPException(
                    status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                    detail="The image contents do not match the uploaded file type",
                )
            if image.width * image.height > MAX_IMAGE_PIXELS:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="The image dimensions are too large",
                )
            image.verify()
    except HTTPException:
        raise
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError) as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The uploaded file is not a valid image",
        ) from exc

    return expected_format


async def create_fact_check(
    claim_text: str,
    image: UploadFile | None,
    user: User,
    db: Session,
) -> FactCheck:
    normalized_text = claim_text.strip()
    if len(normalized_text) > MAX_CLAIM_CHARACTERS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Claim text cannot exceed {MAX_CLAIM_CHARACTERS} characters",
        )

    image_data: bytes | None = None
    image_mime: str | None = None
    image_name: str | None = None
    if image is not None and image.filename:
        try:
            image_data = await image.read(MAX_IMAGE_BYTES + 1)
        finally:
            await image.close()
        if len(image_data) > MAX_IMAGE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Image size cannot exceed 10 MB",
            )
        image_mime = _validate_image(image_data, image.content_type)
        image_name = image.filename.replace("\\", "/").split("/")[-1][:255]
    elif image is not None:
        await image.close()

    if not normalized_text and image_data is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Add claim text or upload an image",
        )

    fact_check = FactCheck(
        user_id=user.id,
        claim_text=normalized_text,
        image_data=image_data,
        image_mime=image_mime,
        image_name=image_name,
        status="awaiting_model",
    )
    db.add(fact_check)
    try:
        db.commit()
        db.refresh(fact_check)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The fact-check submission could not be saved",
        ) from exc
    return fact_check


def get_fact_check(check_id: UUID, user: User, db: Session) -> FactCheck:
    fact_check = db.scalar(
        select(FactCheck).where(
            FactCheck.id == check_id,
            FactCheck.user_id == user.id,
        )
    )
    if fact_check is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fact-check not found",
        )
    return fact_check
