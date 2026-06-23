import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.core.config import settings
from app.core.database import get_db
from app.models import MediaAsset

router = APIRouter(prefix="/media", tags=["media"])

IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"}
VIDEO_EXT = {".mp4", ".webm", ".mov"}


@router.post("/upload", dependencies=[Depends(require_admin)])
async def upload(file: UploadFile = File(...), db: Session = Depends(get_db)):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in IMAGE_EXT | VIDEO_EXT:
        raise HTTPException(400, f"Unsupported file type: {ext}")

    os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
    name = f"{uuid.uuid4().hex}{ext}"
    dest = os.path.join(settings.MEDIA_ROOT, name)

    size = 0
    with open(dest, "wb") as f:
        while chunk := await file.read(1024 * 1024):
            size += len(chunk)
            if size > settings.MAX_UPLOAD_MB * 1024 * 1024:
                f.close()
                os.remove(dest)
                raise HTTPException(413, "File too large")
            f.write(chunk)

    kind = "image" if ext in IMAGE_EXT else "video"
    width = height = None
    thumb_url = ""
    if kind == "image" and ext != ".svg":
        from app.services.image import optimize_image

        width, height, thumb_path = optimize_image(dest)
        if thumb_path:
            thumb_url = f"{settings.MEDIA_URL}/{os.path.basename(thumb_path)}"

    asset = MediaAsset(
        filename=file.filename or name,
        url=f"{settings.MEDIA_URL}/{name}",
        thumb_url=thumb_url,
        kind=kind,
        size_bytes=size,
        width=width,
        height=height,
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return {
        "id": asset.id,
        "url": asset.url,
        "thumb_url": asset.thumb_url,
        "kind": asset.kind,
        "width": width,
        "height": height,
    }


@router.get("", dependencies=[Depends(require_admin)])
def list_assets(db: Session = Depends(get_db)):
    return db.query(MediaAsset).order_by(MediaAsset.created_at.desc()).all()


@router.delete("/{asset_id}", dependencies=[Depends(require_admin)])
def delete_asset(asset_id: int, db: Session = Depends(get_db)):
    asset = db.get(MediaAsset, asset_id)
    if asset:
        for u in (asset.url, asset.thumb_url):
            if not u:
                continue
            path = os.path.join(settings.MEDIA_ROOT, os.path.basename(u))
            if os.path.exists(path):
                os.remove(path)
        db.delete(asset)
        db.commit()
    return {"detail": "deleted"}
