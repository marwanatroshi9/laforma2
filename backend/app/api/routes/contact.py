from fastapi import APIRouter, BackgroundTasks, Depends, Request
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.core.database import get_db
from app.core.limiter import limiter
from app.models import ContactMessage, QuoteRequest
from app.schemas import ContactIn, QuoteIn
from app.services.email import notify_contact, notify_quote

router = APIRouter(tags=["contact"])


@router.post("/contact")
@limiter.limit("20/minute")
def submit_contact(request: Request, payload: ContactIn, bg: BackgroundTasks, db: Session = Depends(get_db)):
    msg = ContactMessage(**payload.model_dump())
    db.add(msg)
    db.commit()
    bg.add_task(notify_contact, payload.full_name, payload.email, payload.message, payload.subject)
    return {"detail": "Message received"}


@router.post("/quote")
@limiter.limit("20/minute")
def submit_quote(request: Request, payload: QuoteIn, bg: BackgroundTasks, db: Session = Depends(get_db)):
    req = QuoteRequest(**payload.model_dump())
    db.add(req)
    db.commit()
    bg.add_task(
        notify_quote, payload.full_name, payload.email, payload.project_type, payload.budget, payload.details
    )
    return {"detail": "Quote request received"}


@router.get("/contact/messages", dependencies=[Depends(require_admin)])
def list_messages(db: Session = Depends(get_db)):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()


@router.get("/quote/requests", dependencies=[Depends(require_admin)])
def list_quotes(db: Session = Depends(get_db)):
    return db.query(QuoteRequest).order_by(QuoteRequest.created_at.desc()).all()
