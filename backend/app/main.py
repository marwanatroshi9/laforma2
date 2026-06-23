import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.routes import (
    auth,
    careers_blog,
    contact,
    content,
    media,
    projects,
    settings as settings_routes,
)
from app.core.config import settings
from app.core.database import Base, engine
from app.core.limiter import limiter
from app.core.middleware import SecurityHeadersMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("arch-platform")

@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
    from app.seed import seed

    seed()
    logger.info("Startup complete.")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url="/docs",
    lifespan=lifespan,
)

# Rate limiting (slowapi)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if settings.SECRET_KEY.startswith("change-me"):
    logger.warning("SECRET_KEY is using the insecure default — set a strong SECRET_KEY in production!")


# Static media
os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
app.mount(settings.MEDIA_URL, StaticFiles(directory=settings.MEDIA_ROOT), name="media")

# Routers
p = settings.API_V1_PREFIX
app.include_router(auth.router, prefix=p)
app.include_router(settings_routes.router, prefix=p)
app.include_router(projects.router, prefix=p)
app.include_router(content.router, prefix=p)
app.include_router(careers_blog.router, prefix=p)
app.include_router(contact.router, prefix=p)
app.include_router(media.router, prefix=p)


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
