# QA Management Tool V2 - Quick Start Guide

**Get up and running in 5 minutes!**

---

## Prerequisites

Before you start, make sure you have:

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- A terminal/command prompt
- A modern browser (Chrome, Firefox, Safari, Edge)

Check your Node.js version:
```bash
node --version
# Should show v18.x.x or higher
```

---

## Installation

### Step 1: Install Dependencies

```bash
# Navigate to project root
cd qa-management-tool-v2

# Install all dependencies (frontend + backend)
npm install
```

This will:
- Install backend dependencies (Express, Prisma, etc.)
- Install frontend dependencies (Vue, Vite, etc.)
- Generate Prisma client
- Setup database

**Time:** ~2-3 minutes

---

## Running the App

### Step 2: Start Development Server

```bash
npm run dev
```

This single command will:
1. ✅ Start Express backend on `http://localhost:3000`
2. ✅ Start Vue frontend on `http://localhost:5173`
3. ✅ Open your browser automatically
4. ✅ Initialize SQLite database (first run only)

**You should see:**
```
[backend] Server running on http://localhost:3000
[frontend] Local: http://localhost:5173
[frontend] ➜ press h to show help
```

**Time:** ~10 seconds

---

## First Time Setup

### Step 3: Import Your Existing Data (Optional)

If you have existing QA tracking data in Obsidian:

1. Open the app in your browser: `http://localhost:5173`
2. Click **"Import"** button in the header
3. Upload your `QA-2026-Tracking.md` file or ZIP containing:
   - `QA-2026-Tracking.md`
   - `test-details/` folder
4. Choose import mode:
   - **Replace All:** Clear database and import (recommended for first time)
   - **Merge:** Add new tests, update existing
   - **Skip Duplicates:** Only import new tests
5. Click **"Import"**
6. Wait for import to complete
7. See your tests in the dashboard!

**Time:** ~30 seconds

---

## Using the App

### Dashboard

- View statistics (total tests, pass/fail counts)
- See recent tests
- Quick actions (Add Test, Export, Import)

### Tests Table

- View all tests in a table
- Sort by date, feature, status, environment
- Filter by status, environment, date range
- Search by feature name, Jira number, notes
- Click any row to view/edit

### Add New Test

1. Click **"Add Test"** button
2. Fill in the form:
   - Date (required)
   - Feature (required)
   - Jira number and URL (optional)
   - Status (required)
   - Environment (required)
   - Evidence links (optional)
   - Notes (optional)
3. Click **"Save"**
4. Test is saved automatically to database!

### Edit Test

1. Click on any test in the table
2. Update any field
3. Click **"Save"**
4. Changes saved automatically!

### Create Detail File

1. Click on a test
2. Click **"Create Detail"** button
3. Edit the markdown content
4. Click **"Save"**
5. Detail file is linked to test automatically!

### Export to Obsidian

1. Click **"Export"** button in header
2. Choose export options:
   - Export all tests
   - Export active tests only
   - Export by date range
   - Export by status
3. Click **"Export"**
4. Download ZIP file
5. Extract ZIP to your Obsidian vault
6. Open in Obsidian!

---

## Common Commands

### Development

```bash
# Start both frontend and backend
npm run dev

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend
```

### Database

```bash
# Open Prisma Studio (database GUI)
cd backend
npm run prisma:studio

# Create new migration
cd backend
npm run prisma:migrate

# Reset database (WARNING: deletes all data)
cd backend
npx prisma migrate reset
```

### Build for Production

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

---

## Project Structure

```
qa-management-tool-v2/
├── frontend/                 # Vue.js app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── views/           # Page views
│   │   ├── stores/          # Pinia state management
│   │   ├── services/        # API calls
│   │   └── App.vue          # Root component
│   └── package.json
│
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   └── server.ts        # Express app
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── dev.db           # SQLite database file
│   └── package.json
│
├── package.json              # Root package (run scripts)
└── README.md
```

---

## Troubleshooting

### Port Already in Use

**Problem:** Port 3000 or 5173 is already in use

**Solution:**
```bash
# Kill process on port 3000 (backend)
# Linux/Mac:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 5173 (frontend)
# Linux/Mac:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Database Not Found

**Problem:** `Error: Database file not found`

**Solution:**
```bash
cd backend
npm run prisma:migrate
```

### Prisma Client Not Generated

**Problem:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
cd backend
npm run prisma:generate
```

### Frontend Can't Connect to Backend

**Problem:** API calls fail with CORS error

**Solution:**
1. Make sure backend is running on port 3000
2. Check backend console for errors
3. Restart both servers:
   ```bash
   # Stop servers (Ctrl+C)
   npm run dev
   ```

### Import Fails

**Problem:** Import returns errors

**Solution:**
1. Check file format matches expected structure
2. Ensure ZIP contains `QA-2026-Tracking.md`
3. Check backend console for detailed error
4. Try with smaller dataset first

---

## Tips and Tricks

### Keyboard Shortcuts

- `Ctrl/Cmd + K` - Quick search
- `Ctrl/Cmd + N` - New test
- `Ctrl/Cmd + S` - Save (in forms)
- `Esc` - Close modal/form

### Auto-Save

- All changes are saved automatically to the database
- No need to click "Save Changes" button
- Changes are instant!

### Search

- Search works across feature, Jira, and notes
- Use filters to narrow down results
- Combine search with filters for best results

### Export Regularly

- Export to Obsidian weekly for backup
- Keep your Obsidian vault in sync
- Use version control (Git) for your exports

### Database Backup

Your database is a single file: `backend/prisma/dev.db`

To backup:
```bash
# Copy database file
cp backend/prisma/dev.db backend/prisma/dev.db.backup

# Or use Git
git add backend/prisma/dev.db
git commit -m "Backup database"
```

---

## Next Steps

### Learn More

- Read the [Requirements Document](./requirements.md) for full feature list
- Read the [Design Document](./design.md) for architecture details
- Check the [API Documentation](./design.md#3-api-design) for endpoint details

### Customize

- Modify database schema in `backend/prisma/schema.prisma`
- Add new components in `frontend/src/components/`
- Add new API endpoints in `backend/src/routes/`

### Deploy

- Build for production: `npm run build`
- Deploy backend to any Node.js hosting (Heroku, Railway, etc.)
- Deploy frontend to Vercel, Netlify, or serve from backend

---

## Support

### Common Issues

1. **App won't start:** Check Node.js version (must be 18+)
2. **Database errors:** Run `cd backend && npm run prisma:migrate`
3. **Import fails:** Check file format and console errors
4. **Export fails:** Check backend console for errors

### Getting Help

- Check the troubleshooting section above
- Read the design document for architecture details
- Check backend console for error messages
- Check browser console for frontend errors

---

## Summary

**To run the app:**
```bash
npm install    # First time only
npm run dev    # Every time
```

**To import data:**
1. Click "Import" in app
2. Upload ZIP or markdown file
3. Choose import mode
4. Click "Import"

**To export data:**
1. Click "Export" in app
2. Choose export options
3. Click "Export"
4. Download ZIP

**That's it! You're ready to go! 🚀**

---

*Last updated: 2026-02-02*
