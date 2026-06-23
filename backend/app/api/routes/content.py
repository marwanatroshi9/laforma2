"""Generic CRUD for the simpler content collections.

Each collection exposes: GET (public list), POST/PUT/DELETE (admin).
Bodies are passed through as dicts so multilingual JSON fields stay flexible.
"""
from typing import Type

from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.core.database import Base, get_db
from app.models import Award, BlogPost, Client, JobPosting, Service, TeamMember

router = APIRouter(tags=["content"])


def _serialize(obj) -> dict:
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}


def register(path: str, model: Type[Base], order_attr: str = "order", published_attr: str | None = None):
    @router.get(f"/{path}", name=f"list_{path}")
    def _list(db: Session = Depends(get_db), include_unpublished: bool = False):
        q = db.query(model)
        if published_attr and not include_unpublished:
            q = q.filter(getattr(model, published_attr).is_(True))
        if hasattr(model, order_attr):
            q = q.order_by(getattr(model, order_attr))
        return [_serialize(o) for o in q.all()]

    @router.post(f"/{path}", dependencies=[Depends(require_admin)], name=f"create_{path}")
    def _create(payload: dict = Body(...), db: Session = Depends(get_db)):
        # Only accept real, non-PK columns — ignore stray keys instead of 500ing.
        columns = {c.name for c in model.__table__.columns}
        clean = {k: v for k, v in payload.items() if k in columns and k != "id"}
        obj = model(**clean)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return _serialize(obj)

    @router.put(f"/{path}/{{item_id}}", dependencies=[Depends(require_admin)], name=f"update_{path}")
    def _update(item_id: int, payload: dict = Body(...), db: Session = Depends(get_db)):
        obj = db.get(model, item_id)
        if not obj:
            raise HTTPException(404, "Not found")
        for k, v in payload.items():
            if hasattr(obj, k) and k != "id":
                setattr(obj, k, v)
        db.commit()
        db.refresh(obj)
        return _serialize(obj)

    @router.delete(f"/{path}/{{item_id}}", dependencies=[Depends(require_admin)], name=f"delete_{path}")
    def _delete(item_id: int, db: Session = Depends(get_db)):
        obj = db.get(model, item_id)
        if obj:
            db.delete(obj)
            db.commit()
        return {"detail": "deleted"}


register("team", TeamMember, published_attr="is_published")
register("services", Service, published_attr="is_published")
register("awards", Award)
register("clients", Client)
register("blog", BlogPost, order_attr="id", published_attr="is_published")
register("careers", JobPosting, order_attr="id", published_attr="is_open")
