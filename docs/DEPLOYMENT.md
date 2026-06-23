# Deployment Guide (for the Buyer)

This guide takes your new website from zero to live on the internet with HTTPS.
No deep technical knowledge required — just follow the steps.

---

## What you need

- A **server (VPS)** running Ubuntu 22.04+ — e.g. Hetzner, DigitalOcean, Contabo,
  AWS Lightsail (2 GB RAM is plenty to start).
- A **domain name** (e.g. `yourstudio.com`) pointed at the server's IP address
  (an `A` record for `@` and `www`).
- 15 minutes.

---

## Step 1 — Install Docker on the server

SSH into your server and run:

```bash
curl -fsSL https://get.docker.com | sh
```

That installs Docker and Docker Compose.

## Step 2 — Upload the project

Copy the project folder to the server (from your computer):

```bash
scp -r architecture-platform root@YOUR_SERVER_IP:/opt/
```

Then on the server:

```bash
cd /opt/architecture-platform
```

## Step 3 — Configure your settings

```bash
cp .env.example .env
nano .env
```

Set, at minimum:

```ini
SECRET_KEY=<paste a long random string>           # see command below
NEXT_PUBLIC_SITE_URL=https://yourstudio.com
BACKEND_CORS_ORIGINS=https://yourstudio.com
FIRST_ADMIN_EMAIL=you@yourstudio.com
FIRST_ADMIN_PASSWORD=<a strong password>
DOMAIN=yourstudio.com                              # used by the HTTPS proxy
ACME_EMAIL=you@yourstudio.com                      # for the SSL certificate
```

Generate a strong `SECRET_KEY`:

```bash
openssl rand -hex 32
```

(Optional) To receive contact/quote emails, fill in the `SMTP_*` values.

## Step 4 — Go live with HTTPS

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

That builds everything and starts an automatic-HTTPS reverse proxy (Caddy),
which fetches a free SSL certificate for your domain.

Wait ~1 minute, then open **https://yourstudio.com** — your site is live.

---

## Step 5 — Customize everything (no code)

Go to **https://yourstudio.com/admin** and sign in with the admin email/password
from your `.env`.

From the dashboard you can change:

- **Branding & Theme** — company name, logo, favicon, colors, fonts, hero video,
  languages, contact details, social links, and SEO.
- **Projects, Team, Services, Awards, Clients, Journal, Careers** — full content.
- **Media Library** — drag-and-drop image/video uploads.
- **Inbox** — contact messages, quote requests, job applications.

Changes appear on the public site within ~30 seconds (cached for speed).

---

## Day-to-day operations

**Update content:** just use `/admin`. No redeploy needed.

**Restart the site:**
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml restart
```

**View logs:**
```bash
docker compose logs -f backend
```

**Back up your data** (database + uploaded media):
```bash
docker compose exec db pg_dump -U arch arch_platform > backup-$(date +%F).sql
docker run --rm -v architecture-platform_media:/m -v $PWD:/out alpine \
  tar czf /out/media-$(date +%F).tar.gz -C /m .
```

**Restore a database backup:**
```bash
cat backup-YYYY-MM-DD.sql | docker compose exec -T db psql -U arch arch_platform
```

---

## Troubleshooting

| Symptom | Fix |
|--------|-----|
| Site not loading | Check the domain's `A` record points to the server IP; wait for DNS to propagate. |
| "Not secure" / no HTTPS | Confirm `DOMAIN` and `ACME_EMAIL` are set, port 80/443 open in the firewall. |
| Admin login fails | Verify `FIRST_ADMIN_EMAIL/PASSWORD` in `.env`, then `docker compose up -d` again. |
| Emails not arriving | Fill in `SMTP_*` in `.env` and restart. |
