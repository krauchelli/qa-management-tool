# QA Management Tool V2 - Requirements

**Feature:** Database-First QA Management Tool with Obsidian Export/Import  
**Architecture:** Vue.js + Express + Prisma + SQLite  
**Status:** 📝 Requirements Phase  
**Created:** 2026-02-02

---

## 1. Overview

### 1.1 Problem Statement

The current V1 tool has critical limitations:
- Must reselect folder after every browser refresh (File System Access API limitation)
- Browser-only architecture limits functionality
- Complex markdown parsing causes save corruption risks
- Tightly coupled to Obsidian vault structure
- No offline database - always depends on file access

### 1.2 Solution

Build a **full-stack web application** with:
- **Frontend:** Vue.js 3 + Vite (modern, reactive UI)
- **Backend:** Express.js (REST API, file system access)
- **Database:** Prisma ORM + SQLite (persistent storage)
- **Export/Import:** Markdown conversion for Obsidian compatibility

### 1.3 Key Benefits

- ✅ **Seamless:** No folder selection, runs like a normal web app
- ✅ **Reliable:** Database-first, no markdown corruption
- ✅ **Fast:** Instant operations, auto-save
- ✅ **Flexible:** Export to Obsidian when needed
- ✅ **Easy to run:** Single command `npm run dev`
- ✅ **Portable:** Can run on any machine with Node.js

---

## 2. User Stories

### 2.1 Core Test Management

**As a QA tester, I want to:**

1. **View all tests** in a dashboard with statistics
   - See total tests, pass/fail counts, status breakdown
   - View tests in table format with sorting and filtering
   - See active tests vs completed backlog separately

2. **Add new test entries** quickly
   - Fill form with: Date, Feature, Jira, Status, Environment, Evidence, Notes
   - Auto-save to database immediately
   - No manual save button needed

3. **Edit existing tests** easily
   - Click on any test to edit
   - Update any field (status, notes, evidence, etc.)
   - Changes save automatically

4. **Delete tests** when needed
   - Remove test from database
   - Confirm before deletion

5. **Search and filter tests**
   - Search by feature name, Jira number, notes
   - Filter by status (passed, failed, in-progress, need-confirmation)
   - Filter by environment (dev, staging, prod)
   - Filter by date range

### 2.2 Detail File Management

**As a QA tester, I want to:**

6. **Create detail files** for complex issues
   - Generate detail file template from test
   - Edit detail content in rich markdown editor
   - Link detail file to test automatically

7. **View detail files** inline
   - Click test to see detail preview
   - Open full detail editor
   - See formatted markdown

8. **Edit detail files** easily
   - Update test scenario, steps, expected/actual results
   - Add evidence links
   - Update root cause analysis

### 2.3 Export to Obsidian

**As a QA tester, I want to:**

9. **Export all data to Obsidian format**
   - Generate `QA-2026-Tracking.md` with Active and Backlog tables
   - Create detail files in `test-details/` folder
   - Match exact format of current markdown files
   - Download as ZIP or save to specified folder

10. **Export with options**
    - Export all tests
    - Export active tests only
    - Export by date range
    - Export by status

### 2.4 Import from Obsidian

**As a QA tester, I want to:**

11. **Import existing markdown data**
    - Parse `QA-2026-Tracking.md` file
    - Import detail files from `test-details/` folder
    - Migrate all existing data to database

12. **Import with conflict resolution**
    - Choose: Replace all, Merge, or Skip duplicates
    - Preview import before confirming
    - See import summary (X tests imported, Y skipped)

### 2.5 Easy Setup and Running

**As a developer/user, I want to:**

13. **Run the app with one command**
    - `npm install` to setup
    - `npm run dev` to start both frontend and backend
    - App opens automatically in browser

14. **Have database auto-initialized**
    - SQLite database created automatically on first run
    - Prisma migrations run automatically
    - No manual database setup needed

15. **See clear instructions**
    - README with quick start guide
    - Environment setup instructions
    - Troubleshooting guide

---

## 3. Acceptance Criteria

### 3.1 Database and Backend

**AC 3.1.1:** SQLite database is created automatically on first run
- Database file: `prisma/dev.db`
- Schema includes: Tests, Evidence, Details, Archives tables
- Prisma migrations run automatically

**AC 3.1.2:** Express API provides REST endpoints
- `GET /api/tests` - Get all tests
- `GET /api/tests/:id` - Get single test
- `POST /api/tests` - Create new test
- `PUT /api/tests/:id` - Update test
- `DELETE /api/tests/:id` - Delete test
- `GET /api/details/:testId` - Get detail file
- `PUT /api/details/:testId` - Update detail file
- `GET /api/stats` - Get statistics

**AC 3.1.3:** Backend handles file operations
- Export markdown files to specified directory
- Import markdown files from specified directory
- Generate ZIP file for download

### 3.2 Frontend UI

**AC 3.2.1:** Dashboard shows statistics
- Total tests count
- Pass/fail/in-progress/need-confirmation counts
- Percentage breakdown
- Recent tests list

**AC 3.2.2:** Test table displays all tests
- Sortable columns (date, feature, status, env)
- Filterable by status, environment, date range
- Search by feature, jira, notes
- Click row to view/edit

**AC 3.2.3:** Forms are user-friendly
- Add test form with all fields
- Edit test form pre-filled with current data
- Date picker for date field
- Dropdown for status and environment
- Validation on required fields

**AC 3.2.4:** Detail editor works smoothly
- Markdown editor with preview
- Template pre-filled for new details
- Save button updates database
- Link back to parent test

### 3.3 Export Functionality

**AC 3.3.1:** Export generates correct markdown format
- Active Tests table matches original format exactly
- Completed Tests Backlog table matches original format
- Detail files use correct Obsidian link format `[[path\|title]]`
- File structure: `QA-2026-Tracking.md` + `test-details/*.md`

**AC 3.3.2:** Export options work correctly
- Export all: Includes all tests and details
- Export active only: Only non-passed tests
- Export by date range: Tests within specified dates
- Export by status: Tests with specific status

**AC 3.3.3:** Export output is valid
- Markdown tables are properly formatted
- Links are clickable in Obsidian
- No data loss during export
- ZIP file contains all files

### 3.4 Import Functionality

**AC 3.4.1:** Import parses markdown correctly
- Reads Active Tests table
- Reads Completed Tests Backlog table
- Extracts all fields (date, feature, jira, status, env, evidence, notes)
- Parses Obsidian links `[[path\|title]]`

**AC 3.4.2:** Import handles detail files
- Reads all `.md` files in `test-details/` folder
- Links detail files to parent tests
- Preserves markdown content

**AC 3.4.3:** Import conflict resolution works
- Replace all: Clears database and imports
- Merge: Adds new tests, updates existing by ID
- Skip duplicates: Only imports new tests

### 3.5 Easy Setup and Running

**AC 3.5.1:** Installation is simple
```bash
npm install
```
- Installs all dependencies (frontend + backend)
- No additional setup needed

**AC 3.5.2:** Running is one command
```bash
npm run dev
```
- Starts Express backend on port 3000
- Starts Vite frontend on port 5173
- Opens browser automatically
- Shows "Server running" message

**AC 3.5.3:** Database initializes automatically
- Prisma generates client on first run
- Creates SQLite database file
- Runs migrations automatically
- Seeds with sample data (optional)

**AC 3.5.4:** README provides clear instructions
- Prerequisites (Node.js version)
- Installation steps
- Running the app
- Project structure
- API documentation
- Troubleshooting

---

## 4. Technical Requirements

### 4.1 Technology Stack

**Frontend:**
- Vue.js 3 (Composition API)
- Vite (build tool)
- Vue Router (routing)
- Pinia (state management)
- Axios (HTTP client)
- TailwindCSS (styling)

**Backend:**
- Node.js 18+
- Express.js 4.x
- Prisma 5.x (ORM)
- SQLite (database)
- TypeScript (type safety)

**Development:**
- Concurrently (run frontend + backend together)
- Nodemon (auto-restart backend)
- ESLint + Prettier (code quality)

### 4.2 Project Structure

```
qa-management-tool-v2/
├── frontend/                 # Vue.js app
│   ├── src/
│   │   ├── components/      # Vue components
│   │   ├── views/           # Page views
│   │   ├── stores/          # Pinia stores
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript types
│   │   └── App.vue
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── server.ts        # Express app
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # DB migrations
│   ├── package.json
│   └── tsconfig.json
├── package.json              # Root package (scripts)
└── README.md
```

### 4.3 Database Schema

**Tests Table:**
```prisma
model Test {
  id          String    @id @default(cuid())
  date        String    // Format: YYYY-MM-DD
  feature     String
  jira        String?
  jiraUrl     String?
  status      TestStatus
  env         TestEnv
  notes       String?
  detailFile  String?   // Path to detail file
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  evidence    Evidence[]
  detail      Detail?
  
  @@index([date])
  @@index([status])
  @@index([feature])
}

enum TestStatus {
  PASSED
  FAILED
  IN_PROGRESS
  NEED_CONFIRMATION
}

enum TestEnv {
  DEV
  STAGING
  PROD
}
```

**Evidence Table:**
```prisma
model Evidence {
  id          String  @id @default(cuid())
  testId      String
  type        String  // "jam.dev", "screenshot", etc.
  url         String
  description String?
  
  test        Test @relation(fields: [testId], references: [id], onDelete: Cascade)
  
  @@index([testId])
}
```

**Detail Table:**
```prisma
model Detail {
  id          String   @id @default(cuid())
  testId      String   @unique
  title       String
  content     String   // Full markdown content
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  test        Test @relation(fields: [testId], references: [id], onDelete: Cascade)
}
```

### 4.4 API Endpoints

**Tests:**
- `GET /api/tests` - Get all tests (with query params for filtering)
- `GET /api/tests/:id` - Get single test with evidence and detail
- `POST /api/tests` - Create new test
- `PUT /api/tests/:id` - Update test
- `DELETE /api/tests/:id` - Delete test

**Details:**
- `GET /api/details/:testId` - Get detail file for test
- `POST /api/details` - Create detail file
- `PUT /api/details/:testId` - Update detail file
- `DELETE /api/details/:testId` - Delete detail file

**Statistics:**
- `GET /api/stats` - Get test statistics

**Export/Import:**
- `POST /api/export` - Export to markdown (returns ZIP)
- `POST /api/import` - Import from markdown (upload ZIP)

### 4.5 Non-Functional Requirements

**Performance:**
- Page load < 2 seconds
- API response < 500ms
- Database queries optimized with indexes

**Reliability:**
- Auto-save prevents data loss
- Database transactions for data integrity
- Error handling on all API endpoints

**Usability:**
- Responsive design (works on mobile/tablet)
- Keyboard shortcuts for common actions
- Loading states for async operations
- Clear error messages

**Maintainability:**
- TypeScript for type safety
- ESLint + Prettier for code consistency
- Modular architecture (easy to extend)
- Comprehensive README

---

## 5. Out of Scope (Future Enhancements)

- User authentication (single-user app for now)
- Real-time collaboration (multi-user)
- Cloud sync (local-only for now)
- Mobile native app
- Advanced analytics and reporting
- Automated testing integration
- CI/CD pipeline

---

## 6. Success Metrics

**Must Have:**
- ✅ App runs with single command `npm run dev`
- ✅ All CRUD operations work (create, read, update, delete tests)
- ✅ Export generates valid Obsidian markdown
- ✅ Import successfully migrates existing data
- ✅ No data loss or corruption

**Nice to Have:**
- ⭐ Search and filter work smoothly
- ⭐ Detail editor has markdown preview
- ⭐ Export/import complete in < 5 seconds
- ⭐ UI is intuitive (no documentation needed for basic use)

---

## 7. Dependencies and Assumptions

**Dependencies:**
- Node.js 18+ installed on user's machine
- npm or yarn package manager
- Modern browser (Chrome, Firefox, Safari, Edge)

**Assumptions:**
- User has basic command line knowledge
- User understands markdown format
- User has existing Obsidian vault (for import/export)
- Single user (no concurrent access)

---

## 8. Risks and Mitigations

**Risk 1:** Complex setup process
- **Mitigation:** Use concurrently to run frontend + backend with one command
- **Mitigation:** Auto-initialize database with Prisma

**Risk 2:** Markdown export format mismatch
- **Mitigation:** Reuse existing parser from V1
- **Mitigation:** Test export with real Obsidian vault

**Risk 3:** Import data corruption
- **Mitigation:** Validate data before import
- **Mitigation:** Provide preview before confirming import
- **Mitigation:** Backup database before import

**Risk 4:** Performance with large datasets
- **Mitigation:** Use database indexes
- **Mitigation:** Implement pagination for large tables
- **Mitigation:** Lazy load detail files

---

## 9. Timeline Estimate

**Phase 1: Setup and Database (Day 1)**
- Project structure setup
- Prisma schema and migrations
- Express API skeleton
- Vue.js app skeleton

**Phase 2: Core Features (Day 2-3)**
- CRUD operations (backend + frontend)
- Test table with sorting/filtering
- Add/Edit test forms
- Dashboard with statistics

**Phase 3: Detail Files (Day 4)**
- Detail file CRUD
- Markdown editor
- Link details to tests

**Phase 4: Export/Import (Day 5)**
- Export service (markdown generation)
- Import service (markdown parsing)
- ZIP file handling
- UI for export/import

**Phase 5: Polish and Testing (Day 6)**
- Error handling
- Loading states
- README documentation
- Manual testing

**Total: ~6 days for MVP**

---

## 10. Next Steps

1. ✅ Requirements approved
2. ⏭️ Create design document
3. ⏭️ Create implementation tasks
4. ⏭️ Begin development

---

*Last updated: 2026-02-02*
