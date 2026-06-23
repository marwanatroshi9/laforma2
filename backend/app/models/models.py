"""Database models for the Architecture Platform.

Multilingual text fields are stored as JSON keyed by locale, e.g.
{"en": "...", "ar": "...", "kmr": "..."} so a single firm can serve
all configured languages without schema changes.
"""
from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


def now() -> datetime:
    return datetime.now(timezone.utc)


class Role(str, Enum):
    superadmin = "superadmin"
    admin = "admin"
    editor = "editor"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255), default="")
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(32), default=Role.admin.value)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class SiteSettings(Base):
    """Single-row table holding the entire white-label configuration."""

    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(primary_key=True)

    # Branding
    company_name: Mapped[dict] = mapped_column(JSON, default=lambda: {"en": "ARCHIPELAGO"})
    tagline: Mapped[dict] = mapped_column(JSON, default=dict)
    logo_url: Mapped[str] = mapped_column(String(512), default="")
    logo_dark_url: Mapped[str] = mapped_column(String(512), default="")
    favicon_url: Mapped[str] = mapped_column(String(512), default="")

    # Theme / colors (CSS variable driven on the frontend)
    color_primary: Mapped[str] = mapped_column(String(32), default="#0A0A0A")
    color_accent: Mapped[str] = mapped_column(String(32), default="#C8A96A")
    color_bg_light: Mapped[str] = mapped_column(String(32), default="#FAFAF8")
    color_bg_dark: Mapped[str] = mapped_column(String(32), default="#0B0B0C")
    color_text_light: Mapped[str] = mapped_column(String(32), default="#101010")
    color_text_dark: Mapped[str] = mapped_column(String(32), default="#F4F4F2")
    default_theme: Mapped[str] = mapped_column(String(16), default="dark")

    # Typography (Google font family names)
    font_heading: Mapped[str] = mapped_column(String(128), default="Cormorant Garamond")
    font_body: Mapped[str] = mapped_column(String(128), default="Inter")

    # Languages
    default_locale: Mapped[str] = mapped_column(String(8), default="en")
    enabled_locales: Mapped[list] = mapped_column(JSON, default=lambda: ["en", "ar", "kmr"])

    # Hero / homepage video
    hero_video_url: Mapped[str] = mapped_column(String(512), default="")
    hero_poster_url: Mapped[str] = mapped_column(String(512), default="")
    hero_title: Mapped[dict] = mapped_column(JSON, default=dict)
    hero_subtitle: Mapped[dict] = mapped_column(JSON, default=dict)

    # Contact
    email: Mapped[str] = mapped_column(String(255), default="")
    phone: Mapped[str] = mapped_column(String(64), default="")
    address: Mapped[dict] = mapped_column(JSON, default=dict)
    map_embed: Mapped[str] = mapped_column(Text, default="")

    # Social media (list of {platform, url})
    social_links: Mapped[list] = mapped_column(JSON, default=list)

    # SEO defaults
    seo_title: Mapped[dict] = mapped_column(JSON, default=dict)
    seo_description: Mapped[dict] = mapped_column(JSON, default=dict)
    seo_keywords: Mapped[str] = mapped_column(Text, default="")
    og_image_url: Mapped[str] = mapped_column(String(512), default="")

    # Misc content blocks (about, footer, stats, etc.) stored flexibly
    content: Mapped[dict] = mapped_column(JSON, default=dict)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=now, onupdate=now
    )


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    name: Mapped[dict] = mapped_column(JSON, default=dict)
    order: Mapped[int] = mapped_column(Integer, default=0)

    projects: Mapped[list["Project"]] = relationship(back_populates="category")


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    title: Mapped[dict] = mapped_column(JSON, default=dict)
    subtitle: Mapped[dict] = mapped_column(JSON, default=dict)
    description: Mapped[dict] = mapped_column(JSON, default=dict)

    category_id: Mapped[int | None] = mapped_column(ForeignKey("categories.id"), nullable=True)
    category: Mapped["Category"] = relationship(back_populates="projects")

    cover_url: Mapped[str] = mapped_column(String(512), default="")
    hero_url: Mapped[str] = mapped_column(String(512), default="")
    video_url: Mapped[str] = mapped_column(String(512), default="")

    location: Mapped[str] = mapped_column(String(255), default="")
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    area_sqm: Mapped[float | None] = mapped_column(Float, nullable=True)
    client_name: Mapped[str] = mapped_column(String(255), default="")
    status: Mapped[str] = mapped_column(String(64), default="completed")

    # Flexible stats e.g. [{"label": {"en": "Floors"}, "value": "42"}]
    stats: Mapped[list] = mapped_column(JSON, default=list)

    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    order: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)

    media: Mapped[list["ProjectMedia"]] = relationship(
        back_populates="project", cascade="all, delete-orphan", order_by="ProjectMedia.order"
    )


class ProjectMedia(Base):
    __tablename__ = "project_media"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"))
    project: Mapped["Project"] = relationship(back_populates="media")

    # kind: image | video | before_after
    kind: Mapped[str] = mapped_column(String(32), default="image")
    url: Mapped[str] = mapped_column(String(512), default="")
    url_secondary: Mapped[str] = mapped_column(String(512), default="")  # "after" image
    caption: Mapped[dict] = mapped_column(JSON, default=dict)
    order: Mapped[int] = mapped_column(Integer, default=0)


class TeamMember(Base):
    __tablename__ = "team_members"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    position: Mapped[dict] = mapped_column(JSON, default=dict)
    bio: Mapped[dict] = mapped_column(JSON, default=dict)
    photo_url: Mapped[str] = mapped_column(String(512), default="")
    social_links: Mapped[list] = mapped_column(JSON, default=list)
    order: Mapped[int] = mapped_column(Integer, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[dict] = mapped_column(JSON, default=dict)
    description: Mapped[dict] = mapped_column(JSON, default=dict)
    icon: Mapped[str] = mapped_column(String(64), default="")
    image_url: Mapped[str] = mapped_column(String(512), default="")
    order: Mapped[int] = mapped_column(Integer, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)


class Award(Base):
    __tablename__ = "awards"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[dict] = mapped_column(JSON, default=dict)
    organization: Mapped[str] = mapped_column(String(255), default="")
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    description: Mapped[dict] = mapped_column(JSON, default=dict)
    image_url: Mapped[str] = mapped_column(String(512), default="")
    order: Mapped[int] = mapped_column(Integer, default=0)


class Client(Base):
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    logo_url: Mapped[str] = mapped_column(String(512), default="")
    website: Mapped[str] = mapped_column(String(512), default="")
    order: Mapped[int] = mapped_column(Integer, default=0)


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    title: Mapped[dict] = mapped_column(JSON, default=dict)
    excerpt: Mapped[dict] = mapped_column(JSON, default=dict)
    body: Mapped[dict] = mapped_column(JSON, default=dict)
    cover_url: Mapped[str] = mapped_column(String(512), default="")
    author: Mapped[str] = mapped_column(String(255), default="")
    tags: Mapped[list] = mapped_column(JSON, default=list)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class JobPosting(Base):
    __tablename__ = "job_postings"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    title: Mapped[dict] = mapped_column(JSON, default=dict)
    description: Mapped[dict] = mapped_column(JSON, default=dict)
    location: Mapped[str] = mapped_column(String(255), default="")
    employment_type: Mapped[str] = mapped_column(String(64), default="full-time")
    is_open: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class JobApplication(Base):
    __tablename__ = "job_applications"

    id: Mapped[int] = mapped_column(primary_key=True)
    job_id: Mapped[int | None] = mapped_column(ForeignKey("job_postings.id"), nullable=True)
    full_name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(64), default="")
    message: Mapped[str] = mapped_column(Text, default="")
    cv_url: Mapped[str] = mapped_column(String(512), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(64), default="")
    subject: Mapped[str] = mapped_column(String(255), default="")
    message: Mapped[str] = mapped_column(Text, default="")
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class QuoteRequest(Base):
    __tablename__ = "quote_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(64), default="")
    project_type: Mapped[str] = mapped_column(String(128), default="")
    budget: Mapped[str] = mapped_column(String(128), default="")
    details: Mapped[str] = mapped_column(Text, default="")
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class HomeSection(Base):
    """Orderable, toggleable homepage sections managed from the dashboard."""

    __tablename__ = "home_sections"

    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[str] = mapped_column(String(64))  # hero, intro, featured, services...
    is_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    order: Mapped[int] = mapped_column(Integer, default=0)
    config: Mapped[dict] = mapped_column(JSON, default=dict)


class MediaAsset(Base):
    __tablename__ = "media_assets"

    id: Mapped[int] = mapped_column(primary_key=True)
    filename: Mapped[str] = mapped_column(String(512))
    url: Mapped[str] = mapped_column(String(512))
    thumb_url: Mapped[str] = mapped_column(String(512), default="")
    kind: Mapped[str] = mapped_column(String(32), default="image")
    size_bytes: Mapped[int] = mapped_column(Integer, default=0)
    width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class Translation(Base):
    """Override strings for UI labels per locale, editable from dashboard."""

    __tablename__ = "translations"

    id: Mapped[int] = mapped_column(primary_key=True)
    locale: Mapped[str] = mapped_column(String(8), index=True)
    key: Mapped[str] = mapped_column(String(128), index=True)
    value: Mapped[str] = mapped_column(Text, default="")
