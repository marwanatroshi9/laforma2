# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Reproducible install from the lockfile (falls back to install if absent).
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Next.js bakes rewrite destinations at build time, so the backend address
# must be present here (not just at runtime) for the /api and /media proxy.
ENV BACKEND_INTERNAL_URL=http://backend:8000
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# node:alpine ships an unprivileged "node" user (uid 1000) — run as it.
USER node
EXPOSE 3000
CMD ["npm", "run", "start"]
