# Archipelago — Luxury Architecture Portfolio & Studio Platform

A premium, white-label architecture website + studio management platform built
to be **resold to architecture firms**. Every firm customizes branding, colors,
fonts, content, languages, projects, team, and SEO from an admin dashboard —
**no code editing required**.

## Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, GSAP, Lenis |
| Backend  | FastAPI, SQLAlchemy 2, Pydantic v2 |
| Database | PostgreSQL 16 |
| Infra    | Docker + Docker Compose |

## Features in this build (Phase 1)

- 🎬 Cinematic hero with **full-screen video background** support + parallax
- ✨ Professional **loading screen** animation, page transitions, GSAP scroll reveals, Framer micro-interactions
- 🌗 **Dark / light mode**, **Lenis smooth scroll**, film-grain overlay
- 🌍 **Multi-language**: English, Arabic (RTL), Kurdish Badini — instant switching
- 🎨 **White-label engine**: company name, logo, favicon, colors, fonts, hero video — all driven by a single `SiteSettings` record and live CSS variables
- 🏛 **Portfolio**: featured projects, categories, search, filtering, project detail with galleries, **before/after slider**, video, stats, related projects
- 👥 Team, Services, Awards, Clients, About, Contact (with working form), Legal pages
- 🔐 JWT auth + role-based permissions (superadmin / admin / editor)
- 📤 Media upload API (images + video) with dimension extraction
- 🔎 SEO: dynamic meta tags, Open Graph, `sitemap.xml`, `robots.txt`

## Quick start (Docker)

```bash
cp .env.example .env        # adjust secrets
docker compose up --build
```

- Frontend → http://localhost:3000
- API docs → http://localhost:8000/docs
- Default admin → `admin@studio.com` / `admin1234`

The database is auto-created and **seeded with demo content** on first run.

## Local development (without Docker)

**Backend**
```bash
cd backend
python -m venv .venv && . .venv/Scripts/activate   # Windows PowerShell
pip install -r requirements.txt
# point DATABASE_URL at a local postgres, then:
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Architecture

```
architecture-platform/
├── backend/
│   └── app/
│       ├── core/          # config, database, security
│       ├── models/        # SQLAlchemy schema (multilingual JSON fields)
│       ├── schemas/       # Pydantic I/O
│       ├── api/routes/    # auth, settings, projects, content, contact, media
│       ├── seed.py        # idempotent demo seed (EN/AR/KMR)
│       └── main.py
└── frontend/
    ├── app/               # App Router pages (home, projects, detail, ...)
    ├── components/        # Hero, Navbar, Footer, ProjectCard, sections, ...
    ├── providers/         # SiteProvider (theme+i18n), SmoothScroll (Lenis+GSAP)
    ├── lib/               # api client, i18n, types
    └── messages/          # en / ar / kmr UI dictionaries
```

### How the white-label theming works
`GET /api/v1/settings` returns one record with branding, colors, fonts, hero
video, languages and SEO. The frontend injects these into CSS variables
(`--color-accent`, `--color-bg`, `--font-heading`, …) at runtime, so a firm can
recolor and rebrand the entire site without a rebuild. Multilingual content is
stored as `{ "en": "...", "ar": "...", "kmr": "..." }` JSON on every text field.

## Build status — all phases complete ✅

- **Phase 1** — Premium public site (hero/video, loading screen, smooth scroll, i18n, dark/light, portfolio).
- **Phase 2** — Full Admin Dashboard (branding/theme editor, media manager, CRUD for every collection).
- **Phase 3** — Blog & Careers front-ends, quote & job-application forms, email notifications.
- **Phase 4** — Image optimization, JSON-LD structured data, analytics, rate limiting & security headers.

## SEO & performance

- Dynamic meta + Open Graph, `sitemap.xml` (incl. projects/blog/careers), `robots.txt`
- **JSON-LD**: `Organization` (site-wide), `Article` (blog), `JobPosting` (careers)
- **Image pipeline**: uploads are auto-downscaled (max 2400px) and a WebP thumbnail is generated
- Optional analytics via env: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` or `NEXT_PUBLIC_GA_ID`

## Security

- JWT auth with role-based permissions; bcrypt password hashing
- **Rate limiting** (slowapi): 10/min on login, 20/min on public forms, 300/min global
- Security headers on both API (FastAPI middleware) and frontend (`next.config.js`)

## Production checklist

1. Set a strong `SECRET_KEY` (the app warns on startup if left default).
2. Set `BACKEND_CORS_ORIGINS` and `NEXT_PUBLIC_SITE_URL` to your real domain(s).
3. Change the seeded admin password (`FIRST_ADMIN_*`) or create a new admin and disable the demo.
4. Configure `SMTP_*` to receive contact / quote / application emails.
5. Put the stack behind HTTPS (reverse proxy / load balancer) — enables HSTS.
6. Use managed Postgres + object storage for `media/` if scaling horizontally.
```
