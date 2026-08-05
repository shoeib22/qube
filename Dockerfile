# syntax=docker/dockerfile:1
# Debian-slim, not alpine — Prisma's musl engine needs libssl.so.1.1, which modern
# Alpine no longer ships, causing a runtime crash on every DB query. Debian doesn't
# have that problem.
FROM node:20-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# ---- deps: install once, cached across builds unless package*.json changes ----
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ---- builder: full Next.js build using the standalone output (next.config.mjs) ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client JS bundle at build time, not read at
# runtime — they MUST be the real public values here, not placeholders (unlike the
# server-only vars below, which docker-compose.yml supplies at container start).
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}

# Server-only vars: never read during `next build`/`prisma generate` (Prisma only
# parses schema.prisma at generate time; it doesn't connect), placeholders are fine —
# docker-compose.yml supplies the real values at container start.
ENV SUPABASE_SERVICE_ROLE_KEY=placeholder
ENV DATABASE_URL=postgresql://placeholder:placeholder@placeholder:5432/postgres
ENV DIRECT_URL=postgresql://placeholder:placeholder@placeholder:5432/postgres
RUN npx prisma generate
RUN npm run build

# ---- runner: minimal image, only the standalone server output ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
