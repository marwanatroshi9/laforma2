from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.api.deps import require_admin
from app.core.database import get_db
from app.models import Category, Project, ProjectMedia
from app.schemas import (
    CategoryIn,
    CategoryOut,
    ProjectIn,
    ProjectMediaIn,
    ProjectMediaOut,
    ProjectOut,
)

router = APIRouter(prefix="/projects", tags=["projects"])


# ---------- Categories ----------
@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.order).all()


@router.post("/categories", response_model=CategoryOut, dependencies=[Depends(require_admin)])
def create_category(payload: CategoryIn, db: Session = Depends(get_db)):
    cat = Category(**payload.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.put("/categories/{cat_id}", response_model=CategoryOut, dependencies=[Depends(require_admin)])
def update_category(cat_id: int, payload: CategoryIn, db: Session = Depends(get_db)):
    cat = db.get(Category, cat_id)
    if not cat:
        raise HTTPException(404, "Category not found")
    for k, v in payload.model_dump().items():
        setattr(cat, k, v)
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/categories/{cat_id}", dependencies=[Depends(require_admin)])
def delete_category(cat_id: int, db: Session = Depends(get_db)):
    cat = db.get(Category, cat_id)
    if cat:
        db.delete(cat)
        db.commit()
    return {"detail": "deleted"}


# ---------- Projects ----------
@router.get("", response_model=list[ProjectOut])
def list_projects(
    db: Session = Depends(get_db),
    category: str | None = Query(None, description="category slug"),
    featured: bool | None = None,
    q: str | None = None,
    include_unpublished: bool = False,
    limit: int = 100,
    offset: int = 0,
):
    query = db.query(Project).options(
        joinedload(Project.media), joinedload(Project.category)
    )
    if not include_unpublished:
        query = query.filter(Project.is_published.is_(True))
    if category:
        query = query.join(Category).filter(Category.slug == category)
    if featured is not None:
        query = query.filter(Project.is_featured.is_(featured))
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                Project.location.ilike(like),
                Project.client_name.ilike(like),
                Project.slug.ilike(like),
            )
        )
    return (
        query.order_by(Project.order, Project.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.get("/{slug}", response_model=ProjectOut)
def get_project(slug: str, db: Session = Depends(get_db)):
    proj = (
        db.query(Project)
        .options(joinedload(Project.media), joinedload(Project.category))
        .filter(Project.slug == slug)
        .first()
    )
    if not proj:
        raise HTTPException(404, "Project not found")
    return proj


@router.post("", response_model=ProjectOut, dependencies=[Depends(require_admin)])
def create_project(payload: ProjectIn, db: Session = Depends(get_db)):
    proj = Project(**payload.model_dump())
    db.add(proj)
    db.commit()
    db.refresh(proj)
    return proj


@router.put("/{proj_id}", response_model=ProjectOut, dependencies=[Depends(require_admin)])
def update_project(proj_id: int, payload: ProjectIn, db: Session = Depends(get_db)):
    proj = db.get(Project, proj_id)
    if not proj:
        raise HTTPException(404, "Project not found")
    for k, v in payload.model_dump().items():
        setattr(proj, k, v)
    db.commit()
    db.refresh(proj)
    return proj


@router.delete("/{proj_id}", dependencies=[Depends(require_admin)])
def delete_project(proj_id: int, db: Session = Depends(get_db)):
    proj = db.get(Project, proj_id)
    if proj:
        db.delete(proj)
        db.commit()
    return {"detail": "deleted"}


# ---------- Project media ----------
@router.post(
    "/{proj_id}/media", response_model=ProjectMediaOut, dependencies=[Depends(require_admin)]
)
def add_media(proj_id: int, payload: ProjectMediaIn, db: Session = Depends(get_db)):
    proj = db.get(Project, proj_id)
    if not proj:
        raise HTTPException(404, "Project not found")
    media = ProjectMedia(project_id=proj_id, **payload.model_dump())
    db.add(media)
    db.commit()
    db.refresh(media)
    return media


@router.delete("/media/{media_id}", dependencies=[Depends(require_admin)])
def delete_media(media_id: int, db: Session = Depends(get_db)):
    media = db.get(ProjectMedia, media_id)
    if media:
        db.delete(media)
        db.commit()
    return {"detail": "deleted"}
