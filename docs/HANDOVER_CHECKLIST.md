# Seller's Handover Checklist

Run through this every time you sell a copy to a new architecture firm.

## 1. Prepare the clean package
- [ ] Run `powershell -ExecutionPolicy Bypass -File scripts\package.ps1`
- [ ] This produces `archipelago-platform-<date>.zip` — the file you deliver.
- [ ] The script automatically removes: your `.env`, dev databases, uploaded
      test media, `node_modules`, `.venv`, `.next`, and git history.

## 2. Fill in the license
- [ ] Open `LICENSE.txt`, fill in Seller, Buyer, and Date.
- [ ] Have both parties sign (the included terms allow ONE production site per sale).

## 3. What the buyer receives
- [ ] The ZIP (clean source).
- [ ] `docs/DEPLOYMENT.md` — their step-by-step go-live guide (it's inside the ZIP).
- [ ] The signed license.
- [ ] Login URL pattern: `https://theirdomain.com/admin`.

## 4. Tell the buyer to change (security)
- [ ] Set a unique `SECRET_KEY` (`openssl rand -hex 32`).
- [ ] Set their own `FIRST_ADMIN_EMAIL` / `FIRST_ADMIN_PASSWORD`.
- [ ] Point `NEXT_PUBLIC_SITE_URL`, `BACKEND_CORS_ORIGINS`, `DOMAIN` to their domain.
- [ ] (Optional) Configure `SMTP_*` for contact/quote emails.

## 5. If you install it for them (optional paid service)
- [ ] Provision a VPS, point their domain's DNS to it.
- [ ] Follow `docs/DEPLOYMENT.md` steps 1–4.
- [ ] Upload their logo, set brand colors/fonts, add their first projects in `/admin`.
- [ ] Hand over the admin credentials and the deployment guide.

## 6. Per-site licensing
- [ ] Each additional website = a new license + a new sale. Keep a record of who
      bought what.

---

### Quick reference — what NOT to ship
Never include these in the ZIP (the package script already excludes them):
`.env`, `*.db` (dev.db), `backend/media/*` (your test uploads),
`node_modules/`, `.venv/`, `.next/`, `.git/`, `frontend/.claude/`.
