#!/usr/bin/env bash
# One-command deployment for a fresh Ubuntu VPS (raw IP, no domain).
# Usage on the server, inside the project folder:
#     bash deploy.sh
# Optional: ADMIN_EMAIL=you@mail.com ADMIN_PW=yourpass bash deploy.sh
set -e
cd "$(dirname "$0")"

echo "==> Detecting public IP..."
IP="$(curl -s https://api.ipify.org || curl -s ifconfig.me)"
if [ -z "$IP" ]; then echo "Could not detect public IP. Set IP manually in .env."; exit 1; fi
echo "    Public IP: $IP"

if ! command -v docker >/dev/null 2>&1; then
  echo "==> Installing Docker..."
  curl -fsSL https://get.docker.com | sh
fi

if [ ! -f .env ]; then
  echo "==> Generating .env..."
  ADMIN_EMAIL="${ADMIN_EMAIL:-admin@studio.com}"
  ADMIN_PW="${ADMIN_PW:-$(openssl rand -base64 12)}"
  cat > .env <<EOF
POSTGRES_USER=arch
POSTGRES_PASSWORD=$(openssl rand -hex 12)
POSTGRES_DB=arch_platform
SECRET_KEY=$(openssl rand -hex 32)
BACKEND_CORS_ORIGINS=http://$IP:3000
FIRST_ADMIN_EMAIL=$ADMIN_EMAIL
FIRST_ADMIN_PASSWORD=$ADMIN_PW
NEXT_PUBLIC_SITE_URL=http://$IP:3000
EOF
  echo "    Admin email:    $ADMIN_EMAIL"
  echo "    Admin password: $ADMIN_PW"
  echo "    (Saved in .env — write the password down now!)"
else
  echo "==> .env already exists — keeping it."
fi

echo "==> Building and starting containers (first run takes a few minutes)..."
docker compose up -d --build

echo "==> Opening firewall ports 22 and 3000..."
ufw allow 22  >/dev/null 2>&1 || true
ufw allow 3000 >/dev/null 2>&1 || true
ufw --force enable >/dev/null 2>&1 || true

echo ""
echo "=================================================="
echo "  ✅ Deployed!"
echo "  Website:  http://$IP:3000"
echo "  Admin:    http://$IP:3000/admin"
echo "  Login:    see the admin email/password printed above"
echo "=================================================="
