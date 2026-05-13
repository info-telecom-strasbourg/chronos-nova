# =============================================
# Stage 1: Dependencies installation stage
# =============================================

# To ensure security and compatibility, regularly update the NODE_VERSION ARG to the latest LTS slim debian variant version
ARG NODE_VERSION=lts-trixie-slim

FROM node:${NODE_VERSION} AS dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/admin/package.json ./apps/admin/

COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/ui/package.json ./packages/ui/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install project dependencies with frozen lockfile for reproducible builds
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    corepack enable pnpm && pnpm install --frozen-lockfile

# =============================================
# Stage 2: Build Next.js app in standalone mode
# =============================================

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# Copy project dependencies from dependencies stage
COPY --from=dependencies /app ./

# Copy application source code
COPY . .

ENV NODE_ENV=production

# Disable telemetry during the build
ENV NEXT_TELEMETRY_DISABLED=1

# If you want to speed up Docker rebuilds, you can cache the build artifacts by adding: --mount=type=cache,target=/app/apps/admin/.next/cache
# This caches the .next/cache directory across builds, but it also prevents .next/cache/fetch-cache from being included in the final image, meaning cached fetch responses from the build won't be available at runtime.
RUN corepack enable pnpm && pnpm --filter @chronos/admin build

# =============================================
# Stage 3: Run Next.js application
# =============================================

FROM node:${NODE_VERSION} AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Disable telemetry during the run time
ENV NEXT_TELEMETRY_DISABLED=1

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=node:node /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/admin/.next/static ./apps/admin/.next/static

# Copy production assets
COPY --from=builder --chown=node:node /app/apps/admin/public ./apps/admin/public

# If you want to persist the fetch cache generated during the build so that cached responses are available immediately on startup, uncomment this line:
# COPY --from=builder --chown=node:node /app/apps/admin/.next/cache ./apps/admin/.next/cache

# Switch to non-root user for security
USER node

# # Expose port 3000 to allow HTTP traffic
# EXPOSE 3000

# Start Next.js standalone server
CMD ["node", "apps/admin/server.js"]
