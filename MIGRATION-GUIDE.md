# Migration Guide - Test Case Library Feature

**Date:** February 4, 2026  
**Feature:** Test Case Library with Tag-Based Reference  
**Migration Type:** Schema Update (Add TestCase & TestCaseTag models)

---

## ⚠️ IMPORTANT: Backup First!

Before running migration, **ALWAYS backup your data** to prevent data loss.

---

## Step-by-Step Migration Process

### Step 1: Backup Current Data

```bash
cd backend
npm run backup
```

**What this does:**
- Exports all data to JSON file (`backups/backup-YYYY-MM-DD.json`)
- Copies database file (`backups/dev-YYYY-MM-DD.db`)
- Shows summary of backed up data

**Expected output:**
```
🔄 Starting database backup...

📦 Fetching tests...
   ✓ Found 18 tests
📦 Fetching tags...
   ✓ Found 12 tags
📦 Fetching evidence...
   ✓ Found 5 evidence records
📦 Fetching details...
   ✓ Found 8 detail records
📦 Fetching test-tag relationships...
   ✓ Found 24 test-tag relationships

💾 Writing backup file...
   ✓ Backup saved to: /path/to/backups/backup-2026-02-04.json

💾 Copying database file...
   ✓ Database copied to: /path/to/backups/dev-2026-02-04.db

✅ Backup completed successfully!

📊 Summary:
   - Tests: 18
   - Tags: 12
   - Evidence: 5
   - Details: 8
   - Test-Tag relationships: 24

📁 Backup location: /path/to/backups/backup-2026-02-04.json
📁 Database backup: /path/to/backups/dev-2026-02-04.db

🚀 You can now safely run: npx prisma migrate dev
```

### Step 2: Run Migration

```bash
npx prisma migrate dev --name add-test-case-library
```

**What this does:**
- Creates new tables: `TestCase`, `TestCaseTag`
- Adds `testCaseId` column to `Test` table
- Adds `testCases` relation to `Tag` table
- Generates Prisma client with new models

**Expected output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

Applying migration `20260204_add_test_case_library`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20260204_add_test_case_library/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (5.22.0) to ./node_modules/@prisma/client
```

### Step 3: Verify Migration

```bash
npm run verify
```

**What this does:**
- Checks if all tables exist
- Verifies data integrity
- Shows current data count

**Expected output:**
```
✅ All tests verified successfully!
📊 Summary:
   - Tests: 18
   - Tags: 12
   - Evidence: 5
   - Details: 8
   - Test-Tag relationships: 24
   - Test Cases: 0 (new table)
   - Test Case Tags: 0 (new table)
```

### Step 4: Restart Backend

```bash
npm run dev
```

**What this does:**
- Restarts backend with new Prisma client
- New API endpoints available:
  - `GET /api/test-cases`
  - `POST /api/test-cases`
  - `GET /api/test-cases/:id`
  - `PUT /api/test-cases/:id`
  - `DELETE /api/test-cases/:id`

---

## 🔄 If Something Goes Wrong

### Option 1: Restore from JSON Backup

```bash
npm run restore backups/backup-2026-02-04.json
```

**What this does:**
- Deletes all current data
- Restores data from backup JSON file
- Preserves all IDs and relationships

### Option 2: Restore Database File

```bash
# Stop backend first
# Then copy backup database file
cp backups/dev-2026-02-04.db prisma/dev.db

# Restart backend
npm run dev
```

### Option 3: Reset and Re-import

```bash
# Reset database
npx prisma migrate reset

# Re-run migrations
npx prisma migrate dev

# Re-import from markdown files
npm run import

# Re-seed tags
npm run seed:tags
```

---

## 📊 What Changed

### New Tables

**TestCase:**
- `id` - Unique identifier
- `title` - Test case title (e.g., "Login with valid credentials")
- `description` - Brief description (optional)
- `steps` - Test steps in markdown
- `expected` - Expected results in markdown
- `priority` - LOW, MEDIUM, HIGH, CRITICAL
- `createdAt`, `updatedAt` - Timestamps

**TestCaseTag:**
- `id` - Unique identifier
- `testCaseId` - Reference to TestCase
- `tagId` - Reference to Tag
- `createdAt` - Timestamp

### Updated Tables

**Test:**
- Added `testCaseId` (optional) - Reference to TestCase

**Tag:**
- Added `testCases` relation - Many-to-many with TestCase

---

## ✅ Post-Migration Checklist

- [ ] Backup completed successfully
- [ ] Migration ran without errors
- [ ] Verify script shows correct data count
- [ ] Backend starts without errors
- [ ] All existing tests still visible in UI
- [ ] All existing tags still work
- [ ] Can create new test case (test API endpoint)
- [ ] Can view test cases list (test API endpoint)

---

## 🆘 Troubleshooting

### Error: "Migration failed"

**Solution:**
1. Check error message
2. Restore from backup: `npm run restore backups/backup-YYYY-MM-DD.json`
3. Fix schema issue
4. Try migration again

### Error: "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
npm run dev
```

### Error: "Data loss detected"

**Solution:**
```bash
npm run restore backups/backup-YYYY-MM-DD.json
```

### Error: "Cannot find backup file"

**Solution:**
```bash
# List available backups
ls -la backend/backups/

# Use specific backup file
npm run restore backups/backup-2026-02-04.json
```

---

## 📝 Notes

- **Backup files location:** `backend/backups/`
- **Backup retention:** Keep at least 3 most recent backups
- **Migration is additive:** No existing data will be deleted
- **testCaseId is optional:** Existing tests will have `testCaseId = null`
- **Backward compatible:** Old tests work without test case reference

---

## 🚀 Next Steps After Migration

1. ✅ Migration successful
2. 🔨 Implement backend services (testCase.service.ts)
3. 🔨 Implement backend controllers (testCase.controller.ts)
4. 🔨 Implement frontend views (TestCaseLibraryView.vue)
5. 🔨 Implement test case selector in test form
6. 🎉 Test full workflow

---

**Last Updated:** February 4, 2026  
**Status:** Ready for Migration
