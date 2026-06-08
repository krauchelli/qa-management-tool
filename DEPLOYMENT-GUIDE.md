# Deployment Guide

**Last Updated:** 2026-06-08

---

## What's in Git

### Tracked
- All source code (`frontend/src/`, `backend/src/`)
- Prisma schema and migrations (`backend/prisma/schema.prisma`, `backend/prisma/migrations/`)
- Docker config (`Dockerfile.dev`, `Dockerfile.frontend.dev`, `docker-compose.staging.yml`)
- Package files (`package.json`, `package-lock.json`)
- Documentation

### Not Tracked (Ignored)
- `node_modules/` — installed inside the Docker image at build time
- `backend/prisma/dev.db` — local SQLite kept as an offline backup only
- `.env` files — must be provided manually on each machine

---

## Environment Variables

Create `backend/.env` with the following:

```env
# Turso — primary database (synced across devices)
TURSO_DATABASE_URL="libsql://<your-db-name>.turso.io"
TURSO_AUTH_TOKEN="your-turso-auth-token"

# Local SQLite fallback (only used by prisma:migrate for local schema work)
DATABASE_URL="file:./dev.db"

PORT=3000
NODE_ENV=development
```

The app connects to Turso at runtime. `DATABASE_URL` is only referenced by the Prisma CLI for local migration commands.

---

## Docker Setup (Staging)

### First-time or after Dockerfile changes:
```bash
docker compose -f docker-compose.staging.yml up --build
```

### Normal start:
```bash
docker compose -f docker-compose.staging.yml up
```

### Full teardown and rebuild:
```bash
docker compose -f docker-compose.staging.yml down --volumes --rmi local
docker compose -f docker-compose.staging.yml up --build
```

> The `--volumes` flag removes the anonymous `node_modules` volume so it gets re-populated from the fresh image.

### Ports
| Service  | Host Port | Container Port |
|----------|-----------|----------------|
| Backend  | 3001      | 3000           |
| Frontend | 5264      | 5264           |

---

## Database

The database is **Turso** (cloud libSQL). Data is always available as long as credentials are in `.env`.

### Scripts (run from `backend/`)

| Command | Purpose |
|---------|---------|
| `npm run turso:setup` | Apply schema to a fresh Turso DB |
| `npm run turso:migrate` | One-time migration of local `dev.db` → Turso |
| `npm run prisma:migrate` | Local SQLite schema migration (dev only) |
| `npm run prisma:generate` | Regenerate Prisma client after schema changes |

### Adding schema changes
1. Update `backend/prisma/schema.prisma`
2. Run `npm run prisma:migrate` locally (creates a migration file)
3. Run `npm run turso:setup` to apply the new migration to Turso
4. Rebuild Docker image: `docker compose -f docker-compose.staging.yml up --build`

---

## Node / Docker Notes

- Backend image uses `node:20-slim` (Debian/glibc) — required for `@libsql/client` native binaries
- `node_modules` is installed inside the image, not mounted from host
- Frontend image uses `node:20-alpine` (no native binaries, fine with musl)

---

## Troubleshooting

### Container shows 500 / TypeScript errors
```bash
docker logs qa-tool-backend-staging
```
Check for missing env vars or module resolution issues. If packages are out of sync, do a full rebuild.

### "Cannot find module" errors in container
The image's `node_modules` is stale. Rebuild:
```bash
docker compose -f docker-compose.staging.yml down --volumes --rmi local
docker compose -f docker-compose.staging.yml up --build
```

### Turso connection refused
Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in `backend/.env`.  
Test connectivity:
```bash
cd backend && node -e "
const { createClient } = require('@libsql/client');
require('dotenv').config();
const c = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
c.execute('SELECT 1').then(() => console.log('OK')).catch(console.error);
"
```
