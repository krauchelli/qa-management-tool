# AGENTS.md — AI Agent Context for QA Management Tool

This file provides context for AI agents (Kiro, Copilot, Cursor, etc.) working on this codebase.

## Project Overview

A personal QA test tracking tool built with Vue 3 + Express + Prisma + SQLite. Tracks test executions, links them to reusable test cases, manages evidence, and supports full data export/import for portability.

## Tech Stack

- **Frontend**: Vue 3, TypeScript, Pinia, Tailwind CSS, Vite (port 5264)
- **Backend**: Express, TypeScript, Prisma ORM, SQLite
- **Database**: SQLite at `backend/prisma/dev.db`
- **Schema**: `backend/prisma/schema.prisma`

## Architecture

```
Frontend (Vue 3 + Pinia)
  → Services (axios via /api proxy)
    → Vite dev proxy (/api → localhost:3000)
      → Express routes → Controllers → Services → Prisma → SQLite
```

All frontend API calls go through `frontend/src/services/api.ts` which uses `baseURL: '/api'` (relative). Vite proxies `/api` to the backend. Never hardcode `localhost:3000` in frontend services.

## Key Directories

```
backend/
  src/controllers/    # Express request handlers
  src/services/       # Business logic (one per domain)
  src/routes/         # Express route definitions
  src/types/index.ts  # Shared TypeScript types (TestStatus, DTOs, etc.)
  prisma/schema.prisma # Database schema (source of truth)

frontend/
  src/views/          # Page components (routed)
  src/components/     # Reusable UI components
  src/stores/         # Pinia state stores
  src/services/       # API service layer (use api.ts instance!)
  src/types/index.ts  # Frontend TypeScript types (mirrors backend)
  src/router/index.ts # Vue Router config
```

## Data Model

- **Test** — A test execution (date, feature, status, env, jira, notes). Has optional `testCaseId` FK.
- **TestCase** — Reusable test template (title, steps, expected, priority). Linked to Tests via `testCaseId`.
- **Detail** — Rich markdown content for a Test (1:1 relationship).
- **Evidence** — Links/screenshots attached to a Test (1:many).
- **Tag** — Categorization labels. Many-to-many with both Test and TestCase via join tables.

## Status Values

`TestStatus = 'PASSED' | 'FAILED' | 'IN_PROGRESS' | 'NEED_CONFIRMATION' | 'BACKLOG'`

BACKLOG is hidden from Kanban main columns (shown in collapsible section at bottom).

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/tests | List tests (filters, pagination) |
| GET/POST/PUT/DELETE | /api/tests/:id | CRUD single test |
| GET/POST/PUT/DELETE | /api/details/:testId | CRUD test details |
| GET/POST/PUT/DELETE | /api/test-cases/:id | CRUD test cases |
| GET | /api/stats | Dashboard statistics |
| GET/POST/PUT/DELETE | /api/tags/:id | CRUD tags |
| GET | /api/data/export/json | Export all data as JSON |
| GET | /api/data/export/zip | Export as ZIP |
| POST | /api/data/import?mode=merge\|replace | Import from JSON |
| GET | /api/data/preview | Current data counts |

## Common Patterns

When adding a new feature:
1. Add/update types in both `backend/src/types/index.ts` AND `frontend/src/types/index.ts`
2. Add backend service method in `backend/src/services/`
3. Add controller method in `backend/src/controllers/`
4. Register route in `backend/src/routes/`
5. Add frontend service in `frontend/src/services/` (use `api` instance from `api.ts`)
6. Add/update Pinia store in `frontend/src/stores/`
7. Add/update Vue component or view
8. Add route in `frontend/src/router/index.ts` if new page

## Important Notes

- Frontend port is **5264** (not 5173). Configured in `frontend/vite.config.ts`.
- Backend CORS allows both 5264 and 5173.
- SQLite DB is a single file — export/import feature handles full data portability.
- `tagService.ts` must use the shared `api` instance, not raw axios with hardcoded URLs.
- Prisma schema uses `String` for status fields (not enum) — validation is app-level.
- Test details use Toast UI Editor for markdown WYSIWYG.
- The `discordFormatter.ts` utility converts markdown to Discord-friendly format.

## Running

```bash
npm run dev          # Start both frontend + backend
# or separately:
cd backend && npm run dev      # Express on :3000
cd frontend && npm run dev     # Vite on :5264
```

## Database

```bash
cd backend
npx prisma studio              # GUI at localhost:5555
npx prisma migrate dev         # Run migrations
npx prisma db push             # Push schema changes
```

## Export/Import (CLI)

```bash
# Export
curl http://localhost:3000/api/data/export/json -o backup.json

# Import (merge)
curl -X POST http://localhost:3000/api/data/import?mode=merge \
  -H "Content-Type: application/json" -d @backup.json

# Import (replace — wipes everything first)
curl -X POST http://localhost:3000/api/data/import?mode=replace \
  -H "Content-Type: application/json" -d @backup.json
```

## Docs

- `README.md` — Setup and feature overview
- `CURRENT-STATUS.md` — Latest feature timeline and changelog
- `POC-DOCUMENT.md` — Original PoC evaluation and success criteria
- `PROJECT-BRIEF.md` — Full project brief with motivation and scope
- `AGENTS.md` — This file (AI agent context)
