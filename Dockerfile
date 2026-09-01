# syntax=docker/dockerfile:1
FROM node:20-slim AS base

# ---- deps: install once, cached across builds unless package*.json changes ----
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: full Next.js build using the standalone output (next.config.mjs) ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client JS bundle at build time, not read at
# runtime — they MUST be the real public values here, not placeholders.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}

# lib/supabaseAdmin.ts constructs its client at module load, not lazily, so `next
# build`'s page-data-collection step (which imports every route module) needs *some*
# string here or the constructor throws — it never actually makes a request at build
# time, so a placeholder is enough. The real secret is runtime-only, supplied by
# docker-compose.yml's `environment:` — never baked into an image layer.
ENV SUPABASE_SERVICE_ROLE_KEY=placeholder-build-time-only

RUN npm run build

# ---- runner: minimal image, only the standalone server output ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# fontconfig + a basic font: sharp (libvips/librsvg) needs these to rasterize
# text in the SVG grid-overlay Plan Mapper draws before calling Gemini
# (lib/planMapper.ts) — node:20-slim ships neither, and text silently drops
# without them.
RUN apt-get update && apt-get install -y --no-install-recommends fontconfig fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*
RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
