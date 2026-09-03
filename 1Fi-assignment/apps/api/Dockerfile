# ---- Base ----
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
RUN corepack enable && corepack prepare pnpm@11.23.0 --activate
COPY pnpm-lock.yaml ./
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/logger/package.json ./packages/logger/
COPY packages/types/package.json ./packages/types/
COPY packages/db/package.json ./packages/db/
RUN pnpm fetch --frozen-lockfile
RUN pnpm install --frozen-lockfile --ignore-scripts

# ---- Builder ----
FROM base AS builder
RUN corepack enable && corepack prepare pnpm@11.23.0 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages       ./packages
COPY --from=deps /app/apps/api      ./apps/api
COPY package.json pnpm-workspace.yaml ./
RUN pnpm --filter @1fi/api run build

# ---- Runner ----
FROM base AS runner
RUN corepack enable && corepack prepare pnpm@11.23.0 --activate
ENV NODE_ENV=production
ENV PORT=3001
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=deps   /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/server.js"]
