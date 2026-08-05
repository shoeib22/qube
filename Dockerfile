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

# lib/supabaseAdmin.ts constructs its client at module load, not lazily — `next build`'s
# page-data-collection step imports every route module (including ones that only touch
# this at request time), so this has to be a real value during build too, even though
# it's a server-only secret never sent to the client. docker-compose.yml supplies the
# actual runtime value separately; this is only consumed at build time.
ARG SUPABASE_SERVICE_ROLE_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}

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
