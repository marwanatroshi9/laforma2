"""Public single-item lookups + job applications.

List & admin CRUD for blog/careers are provided by the generic content router;
this adds the detail-by-slug reads and the application submission flow.
"""
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.core.database import get_db
from app.core.limiter import limiter
from app.models import BlogPost, JobApplication, JobPosting
from app.schemas import ApplicationIn
from app.services.email import notify_application

router = APIRouter(tags=["careers_blog"])


def _serialize(obj) -> dict:
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}


@router.get("/blog/{slug}")
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(404, "Post not found")
    return _serialize(post)


@router.get("/careers/applications", dependencies=[Depends(require_admin)])
def list_applications(db: Session = Depends(get_db)):
    return db.query(JobApplication).order_by(JobApplication.created_at.desc()).all()


@router.get("/careers/{slug}")
def get_job(slug: str, db: Session = Depends(get_db)):
    job = db.query(JobPosting).filter(JobPosting.slug == slug).first()
    if not job:
        raise HTTPException(404, "Job not found")
    return _serialize(job)


@router.post("/careers/apply")
@limiter.limit("20/minute")
def apply(request: Request, payload: ApplicationIn, bg: BackgroundTasks, db: Session = Depends(get_db)):
    app_row = JobApplication(**payload.model_dump())
    db.add(app_row)
    db.commit()

    role = ""
    if payload.job_id:
        job = db.get(JobPosting, payload.job_id)
        if job:
            role = (job.title or {}).get("en", "")
    bg.add_task(notify_application, payload.full_name, payload.email, role, payload.message, payload.cv_url)
    return {"detail": "Application received"}