# Deployment Guide

## What's Already in Git

Your `.gitignore` is properly configured. The following are **already tracked** in git:

### ✅ Tracked (In Git)
- All source code (`frontend/src/`, `backend/src/`)
- Configuration files (`package.json`, `tsconfig.json`, etc.)
- Prisma schema (`backend/prisma/schema.prisma`)
- Documentation (`.md` files in root and `.kiro/`)
- `.gitignore` itself

### ❌ Not Tracked (Ignored)
- `node_modules/` (will be installed via `npm install`)
- `dist/` (will be built via `npm run build`)
- `backend/prisma/dev.db` (database file - needs manual handling)
- `.env` files (if you create them)
- `v1-backup/` folder

---

## 🚨 Critical: What You MUST Copy Manually

### 1. Database File (IMPORTANT!)
**File:** `backend/prisma/dev.db`

This contains all your test data (21 tests, evidence, details). You have 2 options:

#### Option A: Copy Database File (Recommended for keeping data)
```bash
# On your local machine
scp qa-management-tool/backend/prisma/dev.db user@server:/path/to/qa-management-tool/backend/prisma/

# Or copy to another machine
cp qa-management-tool/backend/prisma/dev.db /backup/location/
```

#### Option B: Start Fresh (Re-import data)
```bash
# After cloning on new machine
cd qa-management-tool/backend
npm install
npx prisma migrate dev  # Creates new empty database
npm run import          # Re-import from markdown files
```

### 2. Environment Variables (If You Have Any)
**Files:** `.env`, `backend/.env`, `frontend/.env`

If you created any `.env` files, copy them manually:
```bash
# Example .env content for backend
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
NODE_ENV=production
```

---

## 📋 Setup on New Machine

### Step 1: Clone Repository
```bash
git clone <your-private-repo-url>
cd qa-management-tool
```

### Step 2: Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: Setup Database

#### If you copied `dev.db`:
```bash
# Just generate Prisma client
cd backend
npx prisma generate
```

#### If starting fresh:
```bash
cd backend
npx prisma migrate dev    # Creates database
npm run import            # Import data from markdown
npm run verify            # Verify import
```

### Step 4: Run Application
```bash
# From root directory
npm run dev
```

Or run separately:
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## 📦 Files/Folders Checklist

### Essential Files (Should be in Git)
- ✅ `package.json` (root, backend, frontend)
- ✅ `backend/prisma/schema.prisma`
- ✅ `backend/src/**/*` (all source code)
- ✅ `frontend/src/**/*` (all source code)
- ✅ `README.md`, `QUICK-START.md`, `CURRENT-STATUS.md`
- ✅ `.gitignore`
- ✅ `backend/tsconfig.json`, `frontend/tsconfig.json`
- ✅ `frontend/vite.config.ts`, `frontend/tailwind.config.js`
- ✅ `backend/nodemon.json`
- ✅ `.kiro/` folder (specs and docs)

### Files to Copy Manually
- 🔴 `backend/prisma/dev.db` (your database!)
- 🟡 `.env` files (if you have any)
- 🟡 `backend/prisma/migrations/` (if you want migration history)

### Files NOT Needed (Will be Generated)
- ❌ `node_modules/` (run `npm install`)
- ❌ `dist/` (run `npm run build`)
- ❌ `backend/prisma/dev.db-journal` (temporary file)
- ❌ `.DS_Store`, `.vscode/`, etc. (editor files)

---

## 🔍 Verify Your Git Repository

Check what's tracked:
```bash
cd qa-management-tool
git status
git ls-files | head -20  # See first 20 tracked files
```

Check what's ignored:
```bash
git status --ignored
```

---

## 🚀 Production Deployment

### Build for Production
```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

### Run Production
```bash
# Backend
cd backend
npm start

# Frontend (serve dist folder with nginx/apache)
# Or use: npm run preview
```

---

## 📝 Quick Reference

### Clone and Run (With Database)
```bash
git clone <repo>
cd qa-management-tool
npm install
# Copy dev.db to backend/prisma/
cd backend && npx prisma generate && cd ..
npm run dev
```

### Clone and Run (Fresh Start)
```bash
git clone <repo>
cd qa-management-tool
npm install
cd backend
npx prisma migrate dev
npm run import
cd ..
npm run dev
```

---

## ⚠️ Important Notes

1. **Database is NOT in Git** - You must copy `dev.db` manually or re-import data
2. **node_modules is NOT in Git** - Run `npm install` on new machine
3. **Environment variables** - Copy `.env` files if you have any
4. **Port conflicts** - Make sure ports 3000 and 5173 are available
5. **Node version** - Requires Node.js 18+

---

## 🆘 Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
cd backend
npm install
npx prisma generate
```

### "Database not found"
```bash
# Option 1: Copy dev.db from backup
cp /backup/dev.db backend/prisma/

# Option 2: Create new and import
cd backend
npx prisma migrate dev
npm run import
```

### "Port already in use"
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

---

## 📊 What's in Your Database

Current data (as of last import):
- 21 tests
- 11 evidence recordings
- 21 detailed documentation
- Date range: July 2025 - February 2026

To backup your database:
```bash
# Create backup
cp backend/prisma/dev.db backend/prisma/dev.db.backup

# Or export to SQL
cd backend
npx prisma db push --force-reset  # Be careful!
```

---

**Last Updated:** 2026-02-02
