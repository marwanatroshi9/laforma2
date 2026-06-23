# Quick Start — Run the Website

You only need **one program installed: Docker**. No coding, no Node, no database setup.

---

## 1. Install Docker (once)

- **Windows / Mac:** download **Docker Desktop** from https://www.docker.com/products/docker-desktop
  and install it (click Next → Next → Finish). Then open it so it's running.
- **Linux server:** run `curl -fsSL https://get.docker.com | sh`

## 2. Unzip the project

Unzip the delivered file. You'll get a folder called `architecture-platform`.
Open a terminal **inside that folder**:

- **Windows:** open the folder, click the address bar, type `cmd`, press Enter.
- **Mac:** right-click the folder → "New Terminal at Folder".

## 3. Create your settings file

Copy the example settings:

- **Windows:** `copy .env.example .env`
- **Mac / Linux:** `cp .env.example .env`

(You can run it with the defaults first to try it; change them later for production.)

## 4. Start it

```bash
docker compose up --build
```

The first time takes a few minutes (it downloads and builds everything).
When you see it settle, it's ready.

## 5. Open it

- **Your website:**  http://localhost:3000
- **Admin dashboard:** http://localhost:3000/admin
  - Email: `admin@studio.com`
  - Password: `admin1234`

The site comes pre-filled with demo content so you can see it working immediately.
Change everything (logo, colors, projects, text, languages) from the admin dashboard.

---

## Stopping & starting again

- **Stop:** press `Ctrl + C` in the terminal, or run `docker compose down`
- **Start again:** `docker compose up` (no need to rebuild)

## Going live on a real domain (with HTTPS)

When you're ready to put it on the internet at your own domain, follow
**`docs/DEPLOYMENT.md`** — it's the same idea, with one extra command that adds
a secure HTTPS address automatically.

## Common questions

| Question | Answer |
|---------|--------|
| "Cannot connect to the Docker daemon" | Docker Desktop isn't running — open it and wait until it says *Running*. |
| Port 3000 already in use | Something else is using it. Close that app, or change `3000` in `docker-compose.yml`. |
| I changed content but don't see it | The public site caches for ~30 seconds. Refresh after a moment. |
| Forgot admin password | Edit `FIRST_ADMIN_PASSWORD` in `.env`, then run `docker compose up -d` again. |
