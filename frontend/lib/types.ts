export type Locale = "en" | "ar" | "kmr";

export type I18nText = Partial<Record<Locale, string>> & Record<string, string>;

export interface SiteSettings {
  id: number;
  company_name: I18nText;
  tagline: I18nText;
  logo_url: string;
  logo_dark_url: string;
  favicon_url: string;
  color_primary: string;
  color_accent: string;
  color_bg_light: string;
  color_bg_dark: string;
  color_text_light: string;
  color_text_dark: string;
  default_theme: "dark" | "light";
  font_heading: string;
  font_body: string;
  default_locale: Locale;
  enabled_locales: Locale[];
  hero_video_url: string;
  hero_poster_url: string;
  hero_title: I18nText;
  hero_subtitle: I18nText;
  email: string;
  phone: string;
  address: I18nText;
  map_embed: string;
  social_links: { platform: string; url: string }[];
  seo_title: I18nText;
  seo_description: I18nText;
  seo_keywords: string;
  og_image_url: string;
  content: Record<string, any>;
}

export interface Category {
  id: number;
  slug: string;
  name: I18nText;
  order: number;
}

export interface ProjectMedia {
  id: number;
  kind: "image" | "video" | "before_after";
  url: string;
  url_secondary: string;
  caption: I18nText;
  order: number;
}

export interface Project {
  id: number;
  slug: string;
  title: I18nText;
  subtitle: I18nText;
  description: I18nText;
  category?: Category | null;
  cover_url: string;
  hero_url: string;
  video_url: string;
  location: string;
  year?: number | null;
  area_sqm?: number | null;
  client_name: string;
  status: string;
  stats: { value: string; label: I18nText }[];
  is_featured: boolean;
  is_published: boolean;
  order: number;
  media: ProjectMedia[];
}

export interface TeamMember {
  id: number;
  name: string;
  position: I18nText;
  bio: I18nText;
  photo_url: string;
  social_links: { platform: string; url: string }[];
}

export interface Service {
  id: number;
  title: I18nText;
  description: I18nText;
  icon: string;
  image_url: string;
}

export interface Award {
  id: number;
  title: I18nText;
  organization: string;
  year?: number | null;
}

export interface Client {
  id: number;
  name: string;
  logo_url: string;
  website: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: I18nText;
  excerpt: I18nText;
  body: I18nText;
  cover_url: string;
  author: string;
  tags: string[];
  published_at: string;
}

export interface JobPosting {
  id: number;
  slug: string;
  title: I18nText;
  description: I18nText;
  location: string;
  employment_type: string;
  is_open: boolean;
}
