from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.core.database import get_db
from app.models import SiteSettings
from app.schemas import SettingsIn, SettingsOut


router = APIRouter(prefix="/settings", tags=["settings"])


def _get_or_create(db: Session) -> SiteSettings:
    s = db.query(SiteSettings).first()
    if not s:
        s = SiteSettings()
        db.add(s)
        db.commit()
        db.refresh(s)
    return s


@router.get("", response_model=SettingsOut)
def get_settings(db: Session = Depends(get_db)):
    """Public: the frontend reads this to render branding, theme, i18n, SEO."""
    return _get_or_create(db)


@router.put("", response_model=SettingsOut, dependencies=[Depends(require_admin)])
def update_settings(payload: SettingsIn, db: Session = Depends(get_db)):
    s = _get_or_create(db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(s, field, value)
    db.commit()
    db.refresh(s)
    return s
