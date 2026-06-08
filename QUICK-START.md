# Quick Start Guide

**Stack:** Express + Prisma + Turso (libSQL) + React + Docker  
**Last Updated:** 2026-06-08

---

## New Machine Setup (After Cloning)

### Step 1: Clone
```bash
git clone <repo-url>
cd qa-management-tool
```

### Step 2: Set Up Environment
Copy your `.env` to `backend/.env`. It must contain:
```env
TURSO_DATABASE_URL="libsql://<your-db>.turso.io"
TURSO_AUTH_TOKEN="your-token-here"
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
```

> `DATABASE_URL` is only used by `prisma:migrate` for local SQLite dev. The app itself always connects via `TURSO_DATABASE_URL`.

### Step 3: Build and Start
```bash
docker compose -f docker-compose.staging.yml up --build
```

That's it. The image handles `npm install` and `prisma generate` internally.

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:5264 |
| Backend  | http://localhost:3001 |

---

## Subsequent Starts (No Code Changes)

```bash
docker compose -f docker-compose.staging.yml up
```

## After Pulling Code Changes

```bash
docker compose -f docker-compose.staging.yml up --build
```

## Full Rebuild From Scratch

```bash
docker compose -f docker-compose.staging.yml down --volumes --rmi local
docker compose -f docker-compose.staging.yml up --build
```

---

## Local Dev (Without Docker)

```bash
cd backend
npm install
npm run dev

# separate terminal
cd frontend
npm install
npm run dev
```

---

## Database

Data lives in **Turso** (cloud-hosted libSQL) — synced across all machines automatically.  
No database file to copy. As long as `backend/.env` has the correct Turso credentials, everything works.

### If you need to re-apply schema to a new Turso DB:
```bash
cd backend
npm run turso:setup
```

### If you need to migrate local SQLite data to Turso (one-time):
```bash
cd backend
npm run turso:migrate
```

---

## Troubleshooting

**500 errors on startup**  
→ Check `docker logs qa-tool-backend-staging` and confirm `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` are in `backend/.env`.

**Port conflicts**  
```bash
lsof -ti:3001 | xargs kill -9
lsof -ti:5264 | xargs kill -9
```

**TypeScript / module errors in container**  
→ The container uses its own `node_modules` (via anonymous volume). If packages are stale, do a full rebuild:
```bash
docker compose -f docker-compose.staging.yml down --volumes --rmi local
docker compose -f docker-compose.staging.yml up --build
```
