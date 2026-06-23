# Professional Code Review & Production-Readiness Audit

Senior-level audit of the full stack — Next.js 15 frontend, FastAPI backend,
PostgreSQL schema, APIs, auth, Docker/deploy. Findings are categorized by
severity; safe fixes were applied and verified with a clean build.

---

## Findings & resolutions

### Critical — none
- **No SQL injection:** every query uses the SQLAlchemy ORM with bound parameters
  (incl. `ilike` search). No string-built SQL.
- **No auth bypass:** JWT (HS256) + bcrypt hashing + `require_admin` role guard on
  every mutating route.
- **No secret leakage:** all secrets are env-driven; the app logs a warning at
  startup if `SECRET_KEY` is left at the default.

### High — fixed
| ID | Issue | Resolution |
|----|-------|-----------|
| H1 | `JsonLd` injected `JSON.stringify()` into a `<script>` without escaping `<` — a `</script>` in admin content could break out | Escape `<` → `<` in `components/JsonLd.tsx` |
| H2 | Both Docker images ran as **root** | Added non-root users (`appuser` backend, `node` frontend) |

### Medium — fixed
| ID | Issue | Resolution |
|----|-------|-----------|
| M1 | Unused dependencies `clsx`, `aiofiles`, `alembic` | Removed from `package.json` / `requirements.txt` |
| M2 | Deprecated `@app.on_event("startup")` | Migrated to the `lifespan` context manager |
| M3 | Generic `create` did `model(**payload)` on a raw dict → `TypeError`/500 on a stray key | Filter payload to real, non-PK columns |
| M4 | Public forms were placeholder-only (no labels) | Added `aria-label` to contact / quote / careers inputs |
| M5 | `<html>` had no `lang`/`dir` server-side (set only client-side) | Set from `default_locale` in the root layout |
| M6 | Frontend image build used `npm install` (non-reproducible) | Use `npm ci` from the committed lockfile |

### Low — noted, intentionally kept
- **L1** `<img>` instead of `next/image`: deliberate for arbitrary external/admin
  URLs; the backend already generates optimized WebP thumbnails on upload.
- **L2** `HomeSection` / `Translation` models are reserved scaffolding for future
  features (harmless empty tables).
- **L3** `editor` role currently has the same powers as `admin` (no granular
  per-resource permissions) — acceptable for the single-tenant resale model.

---

## Area-by-area assessment

**Architecture** — Clean separation: `core / models / schemas / api.routes /
services`. Frontend uses server components for data + client components for
interactivity. Maintainable and typed end-to-end. ✅

**Database** — Single-row `SiteSettings` for white-label config; multilingual JSON
fields; FK relationships with cascade on `ProjectMedia`; indexed slugs/emails.
`joinedload` avoids N+1 on project listing. ✅

**APIs** — RESTful, consistent prefixes, Pydantic validation on typed routes,
correct route ordering (e.g. `/careers/applications` before `/careers/{slug}`). ✅

**Auth & security** — JWT + bcrypt, role guard, slowapi rate limiting (10/min
login, 20/min forms, 300/min global), security headers on API + frontend, CORS
locked to configured origins, change-password + reset tooling. ✅

**Performance** — ISR/`revalidate` caching, image downscaling + WebP thumbnails,
lazy-loaded gallery images, GSAP/observer cleanup (no leaks). ✅

**Deployment** — Docker multi-stage frontend, healthchecks, Postgres + media
volumes, one-command HTTPS overlay (Caddy), non-root containers. ✅

**Responsive / a11y / SEO** — Audited separately (see `RESPONSIVE_AUDIT.md`);
dynamic meta, OG, sitemap, robots, JSON-LD (Organization/Article/JobPosting). ✅

---

## Verification

- Backend: `py_compile` clean; restarts via `lifespan` ("Startup complete", no
  deprecation warnings); `/health`, `/settings`, `/team` → 200.
- Frontend: `next build` → **compiled successfully, 29 routes, 0 type errors**.
- Live: `<html lang>` set, JSON-LD renders, home/admin/forms load 200.
- No automated test suite exists in the project (see manual actions).

---

## Health score: 88 / 100

Breakdown: Architecture 19/20 · Security 18/20 · Performance 17/20 ·
Maintainability 18/20 · **Testing 6/10** (no automated tests) ·
Deployment 10/10. The single biggest deduction is the absence of an automated
test suite.

## Production-readiness: READY (single-tenant / SMB resale)

Safe to deploy for the intended use (one architecture firm per license, self- or
managed-hosted) once the manual prerequisites below are done. Not yet hardened
for large multi-tenant SaaS scale.

## Remaining manual actions
1. **Set a strong `SECRET_KEY`** and change the seeded admin password before going live.
2. **Configure `SMTP_*`** to actually receive contact/quote/application emails.
3. **Add an automated test suite** (pytest for the API, Playwright/RTL for the
   frontend) — the main gap for an enterprise-grade bar.
4. **Reinstall dependencies cleanly** after the removals (`pip install -r
   requirements.txt` in a fresh venv, `npm ci`) so dropped packages don't linger
   locally — Docker images are already clean.
5. **For horizontal scale:** move uploaded media to object storage (S3/R2) and use
   managed Postgres; consider granular role permissions if many editors are added.
6. **Regenerate the buyer ZIP** so all fixes ship: `scripts\package.ps1`.
