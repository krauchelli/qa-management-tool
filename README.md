# QA Management Tool V2

**Database-First QA Management Tool with Obsidian Export/Import**

Built with Vue.js + Express + Prisma + SQLite

---

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### Running the App

```bash
# Start both frontend and backend with one command
npm run dev
```

This will:
- Start Express backend on `http://localhost:3000`
- Start Vue frontend on `http://localhost:5173`
- Open browser automatically

### Access the App

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/health

---

## Project Structure

```
qa-management-tool/
├── frontend/                 # Vue.js app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── views/           # Page views
│   │   ├── stores/          # Pinia stores
│   │   ├── services/        # API service layer
│   │   ├── router/          # Vue Router
│   │   └── types/           # TypeScript types
│   └── package.json
│
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── server.ts        # Express app
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── dev.db           # SQLite database
│   └── package.json
│
├── .kiro/specs/qa-tool-v2/  # Specification documents
│   ├── requirements.md
│   ├── design.md
│   ├── tasks.md
│   └── QUICK-START.md
│
└── package.json              # Root package (scripts)
```

---

## Features

### Core Functionality
- ✅ Create, read, update, delete tests
- ✅ Create and edit detail files
- ✅ Search and filter tests
- ✅ Sort by any column
- ✅ Dashboard with statistics
- ✅ Auto-save (no manual save button!)

### Export/Import
- ✅ Export to Obsidian markdown format
- ✅ Import from existing Obsidian vault
- ✅ Multiple export options
- ✅ Conflict resolution

---

## Development

### Backend Commands

```bash
cd backend

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Prisma commands
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Create migration
npm run prisma:studio    # Open Prisma Studio (DB GUI)
npm run prisma:push      # Push schema to database
```

### Frontend Commands

```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Database

### Schema

The database uses SQLite with Prisma ORM. Schema includes:

- **Tests** - Test entries with date, feature, jira, status, environment
- **Evidence** - Evidence links (jam.dev, screenshots, etc.)
- **Details** - Detail files with markdown content

### Viewing Database

```bash
cd backend
npm run prisma:studio
```

This opens Prisma Studio at `http://localhost:5555` where you can view and edit data.

---

## API Endpoints

### Tests
- `GET /api/tests` - Get all tests
- `GET /api/tests/:id` - Get single test
- `POST /api/tests` - Create test
- `PUT /api/tests/:id` - Update test
- `DELETE /api/tests/:id` - Delete test

### Details
- `GET /api/details/:testId` - Get detail file
- `POST /api/details` - Create detail
- `PUT /api/details/:testId` - Update detail
- `DELETE /api/details/:testId` - Delete detail

### Statistics
- `GET /api/stats` - Get test statistics

### Export/Import
- `POST /api/export` - Export to markdown ZIP
- `POST /api/import` - Import from markdown ZIP

---

## Documentation

### Main Documentation
- [README](./README.md) - This file
- [Quick Start](./QUICK-START.md) - Quick start guide
- [Current Status](./CURRENT-STATUS.md) - Current project status

### Developer Documentation
- [Setup Guide](./.kiro/docs/SETUP.md) - Detailed setup instructions
- [Test Setup](./.kiro/docs/TEST-SETUP.md) - Testing setup
- [Data Import](./.kiro/docs/DATA-IMPORT.md) - Import data from markdown
- [Quick Reference](./.kiro/docs/QUICK-REFERENCE.md) - Quick reference

### Specifications
- [Requirements](./.kiro/specs/qa-tool-v2/requirements.md) - Full feature requirements
- [Design](./.kiro/specs/qa-tool-v2/design.md) - Technical design and architecture
- [Tasks](./.kiro/specs/qa-tool-v2/tasks.md) - Implementation task list

### Project History
- [Phase Completion Docs](./.kiro/docs/phases/) - Phase 1-5 summaries
- [Bug Fixes](./.kiro/docs/fixes/) - Bug fix documentation
- [Archived Docs](./.kiro/docs/archive/) - Archived development docs
- [Documentation Index](./.kiro/docs/README.md) - Full documentation index

---

## Troubleshooting

### Port Already in Use

If port 3000 or 5173 is in use:

```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Issues

```bash
cd backend
npm run prisma:generate  # Regenerate Prisma client
npm run prisma:push      # Sync database with schema
```

### Frontend Can't Connect to Backend

1. Make sure backend is running on port 3000
2. Check backend console for errors
3. Restart both servers: `npm run dev`

---

## License

MIT

---

## Status

✅ **Production Ready** - All phases complete!

**Current Version:** 2.0.0

**Completed:**
- ✅ Phase 1: Project Setup & Database
- ✅ Phase 2: Backend API Implementation
- ✅ Phase 3: Frontend Core Features
- ✅ Phase 4: Forms & Detail Views
- ✅ Phase 5: Data Import from Markdown

**Statistics:**
- 21 tests imported
- 11 evidence recordings
- 21 detailed documentation

See [CURRENT-STATUS.md](./CURRENT-STATUS.md) for full details.

---

*Last updated: 2026-02-02*
