from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, EmailStr


class ORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ---- Auth ----
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(ORM):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool


# ---- Generic content (uses dict passthrough for multilingual JSON) ----
class CategoryIn(BaseModel):
    slug: str
    name: dict = {}
    order: int = 0


class CategoryOut(ORM):
    id: int
    slug: str
    name: dict
    order: int


class ProjectMediaIn(BaseModel):
    kind: str = "image"
    url: str = ""
    url_secondary: str = ""
    caption: dict = {}
    order: int = 0


class ProjectMediaOut(ProjectMediaIn, ORM):
    id: int


class ProjectIn(BaseModel):
    slug: str
    title: dict = {}
    subtitle: dict = {}
    description: dict = {}
    category_id: Optional[int] = None
    cover_url: str = ""
    hero_url: str = ""
    video_url: str = ""
    location: str = ""
    year: Optional[int] = None
    area_sqm: Optional[float] = None
    client_name: str = ""
    status: str = "completed"
    stats: list = []
    is_featured: bool = False
    is_published: bool = True
    order: int = 0


class ProjectOut(ProjectIn, ORM):
    id: int
    media: list[ProjectMediaOut] = []
    category: Optional[CategoryOut] = None


class SettingsOut(ORM):
    model_config = ConfigDict(from_attributes=True, extra="allow")
    id: int
    company_name: dict
    tagline: dict
    logo_url: str
    logo_dark_url: str
    favicon_url: str
    color_primary: str
    color_accent: str
    color_bg_light: str
    color_bg_dark: str
    color_text_light: str
    color_text_dark: str
    default_theme: str
    font_heading: str
    font_body: str
    default_locale: str
    enabled_locales: list
    hero_video_url: str
    hero_poster_url: str
    hero_title: dict
    hero_subtitle: dict
    email: str
    phone: str
    address: dict
    map_embed: str
    social_links: list
    seo_title: dict
    seo_description: dict
    seo_keywords: str
    og_image_url: str
    content: dict


class SettingsIn(BaseModel):
    """Partial update — any subset of settings fields."""
    model_config = ConfigDict(extra="ignore")

    company_name: Optional[dict] = None
    tagline: Optional[dict] = None
    logo_url: Optional[str] = None
    logo_dark_url: Optional[str] = None
    favicon_url: Optional[str] = None
    color_primary: Optional[str] = None
    color_accent: Optional[str] = None
    color_bg_light: Optional[str] = None
    color_bg_dark: Optional[str] = None
    color_text_light: Optional[str] = None
    color_text_dark: Optional[str] = None
    default_theme: Optional[str] = None
    font_heading: Optional[str] = None
    font_body: Optional[str] = None
    default_locale: Optional[str] = None
    enabled_locales: Optional[list] = None
    hero_video_url: Optional[str] = None
    hero_poster_url: Optional[str] = None
    hero_title: Optional[dict] = None
    hero_subtitle: Optional[dict] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[dict] = None
    map_embed: Optional[str] = None
    social_links: Optional[list] = None
    seo_title: Optional[dict] = None
    seo_description: Optional[dict] = None
    seo_keywords: Optional[str] = None
    og_image_url: Optional[str] = None
    content: Optional[dict] = None


class ContactIn(BaseModel):
    full_name: str
    email: EmailStr
    phone: str = ""
    subject: str = ""
    message: str


class QuoteIn(BaseModel):
    full_name: str
    email: EmailStr
    phone: str = ""
    project_type: str = ""
    budget: str = ""
    details: str = ""


class ChangePasswordIn(BaseModel):
    current_password: str
    new_password: str


class ApplicationIn(BaseModel):
    job_id: Optional[int] = None
    full_name: str
    email: EmailStr
    phone: str = ""
    message: str = ""
    cv_url: str = ""


class Message(BaseModel):
    detail: str = "ok"
    data: Any = None
