# Deployment Checklist

Quick checklist for deploying to a new machine.

## ☑️ Before Pushing to Git

- [x] All source code committed
- [x] `.gitignore` configured properly
- [x] Documentation up to date
- [ ] Backup database file (`backend/prisma/dev.db`)
- [ ] Note any `.env` variables you're using

## ☑️ On New Machine

### 1. Clone & Install
```bash
git clone <your-repo>
cd qa-management-tool
npm install
```

### 2. Database Setup
Choose one:

**Option A: Copy existing database**
```bash
# Copy dev.db to backend/prisma/
cd backend
npx prisma generate
```

**Option B: Start fresh**
```bash
cd backend
npx prisma migrate dev
npm run import
npm run verify
```

### 3. Run
```bash
npm run dev
```

### 4. Verify
- [ ] Backend running on http://localhost:3000
- [ ] Frontend running on http://localhost:5173
- [ ] Can see tests in dashboard
- [ ] Can create new test
- [ ] Can view test details

## 🔴 Critical Files to Copy Manually

1. **Database:** `backend/prisma/dev.db`
2. **Environment:** `.env` files (if any)

## ✅ Files Already in Git

- All source code
- Configuration files
- Documentation
- Prisma schema

## ❌ Files NOT in Git (Will be Generated)

- `node_modules/`
- `dist/`
- `backend/prisma/dev.db`
- `.env` files

---

**See [DEPLOYMENT-GUIDE.md](../../DEPLOYMENT-GUIDE.md) for detailed instructions.**
