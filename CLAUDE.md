# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chronos is a student internship directory for Télécom Physique Strasbourg. It's a pnpm monorepo with two Next.js apps and shared packages.

## Commands

```bash
# Development
pnpm dev                              # Run all apps in parallel
pnpm --filter @chronos/client dev     # Run client app only
pnpm --filter admin dev               # Run admin app only

# Build & Lint
pnpm build                            # Build all packages
pnpm lint                             # Biome check (lint + format)
pnpm lint:fix                         # Biome auto-fix

# Database (run from packages/db or use --filter)
pnpm --filter @chronos/db db:push     # Push schema to DB
pnpm --filter @chronos/db db:pull     # Pull schema from DB
pnpm --filter @chronos/db db:generate # Generate migrations
pnpm --filter @chronos/db db:migrate  # Run migrations
pnpm --filter @chronos/db db:studio   # Open Drizzle Studio
pnpm --filter @chronos/db db:seed     # Seed DB with fake data

# Pre-commit hook runs: pnpm test && pnpm lint && pnpm build
```

## Architecture

```
apps/
  client/    - @chronos/client - Public-facing Next.js 16 app (RSC, React Compiler)
  admin/     - admin - Admin dashboard (Supabase-based, legacy, excluded from biome)
packages/
  db/        - @chronos/db - Drizzle ORM schema, relations, queries, seed
  env/       - @chronos/env - Zod-validated environment variables
  ui/        - @chronos/ui - Shared UI components (Base UI + Tailwind + CVA)
  typescript-config/ - Shared tsconfig presets
```

### Key Design Decisions

- **Dependency versions** are unified via the pnpm catalog in `pnpm-workspace.yaml` — always use `catalog:` in package.json
- **Client app** uses `@chronos/ui` for all shared components. Path alias `@chronos/ui/*` maps to `../../packages/ui/src/*`. Local components go in `src/components/`
- **Client app** uses `@/*` path alias for `./src/*`
- **Admin app** is excluded from biome linting (`!apps/admin/*` in biome.json) — it's a legacy Supabase app
- **DB package** exports schema from `src/schema/` and queries from `src/queries/`. The drizzle instance in `src/index.ts` has the full schema passed for `db.query` relational API
- **Environment** variables come from root `.env` file. Client/DB scripts use `dotenv -e ../../.env --` prefix. The `@chronos/env` package validates with Zod
- **Database** is PostgreSQL via Docker Compose (`docker-compose.yaml`)

### Client App Data Flow

Server action (`src/actions/`) → `@chronos/db/src/queries/` → Drizzle ORM → PostgreSQL

Client components use `@tanstack/react-query` (useInfiniteQuery) to call server actions. URL state (search, filters, sort) is managed by `nuqs` searchParams.

### DB Schema (packages/db/src/schema/)

Core tables: `internships` → `students` → `majors`/`options`, `internships` → `organizations`. Relations defined in `relations.ts`. Enums: `academic_year` (1A/2A/3A), `state` (visible/draft/deleted), `organization_type` (company/not_company), `degree` (gene/ir/ti).

### UI Components

Shared components live in `packages/ui/src/components/` and are exported via `@chronos/ui/components/*`. They use Base UI primitives (not Radix), `cn()` from `@chronos/ui/lib/utils`, and Tailwind CSS 4. The client app also has Radix-based components (select, separator) installed directly.

## Code Style

- **Formatter**: Biome with double quotes, space indent, organized imports
- **Language**: French for UI text, comments, and variable naming in domain logic. English for code structure
- **Commit messages**: Use emoji prefix (✨ feature, 🐛 fix, 🔧 config, 🎨 UI, 🌱 seed, 📦 deps, 🐳 docker)
