# QA Management Tool V2 - Design Document

**Feature:** Database-First QA Management Tool with Obsidian Export/Import  
**Status:** 📐 Design Phase  
**Created:** 2026-02-02

---

## 1. Architecture Overview

### 1.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Vue.js Frontend (Port 5173)              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │ │
│  │  │  Dashboard  │  │ Test Table  │  │ Detail Editor│  │ │
│  │  └─────────────┘  └─────────────┘  └──────────────┘  │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │ │
│  │  │ Pinia Store │  │ API Service │  │   Router     │  │ │
│  │  └─────────────┘  └─────────────┘  └──────────────┘  │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP (Axios)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Express Backend (Port 3000)                    │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                    REST API                           │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │ │
│  │  │   Routes    │→ │ Controllers │→ │   Services   │  │ │
│  │  └─────────────┘  └─────────────┘  └──────────────┘  │ │
│  └───────────────────────────────────────────────────────┘ │
│                            │                                │
│                            ▼                                │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Prisma ORM Client                        │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              SQLite Database (dev.db)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Tests   │  │ Evidence │  │ Details  │  │ Archives │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Decisions

**Why Vue.js over React?**
- Simpler learning curve
- Better documentation
- Composition API similar to React Hooks
- Smaller bundle size
- Better TypeScript support out of the box

**Why Express over NestJS/Fastify?**
- Simpler, more straightforward
- Huge ecosystem
- Easy to understand for beginners
- Perfect for small-medium apps

**Why Prisma over TypeORM/Sequelize?**
- Best TypeScript support
- Auto-generated types
- Great migrations system
- Excellent DX (developer experience)
- Modern and actively maintained

**Why SQLite over PostgreSQL/MySQL?**
- Zero configuration
- Single file database
- Perfect for local apps
- Fast for small-medium datasets
- Easy to backup (just copy file)

---

## 2. Database Design

### 2.1 Complete Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Test {
  id          String      @id @default(cuid())
  date        String      // YYYY-MM-DD format
  feature     String
  jira        String?
  jiraUrl     String?
  status      TestStatus
  env         TestEnv
  notes       String?
  detailFile  String?     // Path like "test-details/ongoing-february-2026"
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  evidence    Evidence[]
  detail      Detail?
  
  @@index([date])
  @@index([status])
  @@index([feature])
}

model Evidence {
  id          String  @id @default(cuid())
  testId      String
  type        String  // "jam.dev", "screenshot", "video", etc.
  url         String
  description String?
  
  test        Test @relation(fields: [testId], references: [id], onDelete: Cascade)
  
  @@index([testId])
}

model Detail {
  id          String   @id @default(cuid())
  testId      String   @unique
  title       String   // Short title for table notes column
  content     String   // Full markdown content
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  test        Test @relation(fields: [testId], references: [id], onDelete: Cascade)
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

### 2.2 Data Relationships

```
Test (1) ──────< (Many) Evidence
  │
  │
  └──────< (One) Detail
```

- One test can have multiple evidence links
- One test can have one detail file (optional)
- Deleting a test cascades to evidence and detail

---

## 3. API Design

### 3.1 REST Endpoints

**Base URL:** `http://localhost:3000/api`

#### Tests Endpoints

```typescript
// GET /api/tests
// Get all tests with optional filtering
Query Params:
  - status?: 'passed' | 'failed' | 'in-progress' | 'need-confirmation'
  - env?: 'dev' | 'staging' | 'prod'
  - search?: string (searches feature, jira, notes)
  - dateFrom?: string (YYYY-MM-DD)
  - dateTo?: string (YYYY-MM-DD)
Response: Test[]

// GET /api/tests/:id
// Get single test with evidence and detail
Response: Test & { evidence: Evidence[], detail?: Detail }

// POST /api/tests
// Create new test
Body: {
  date: string
  feature: string
  jira?: string
  jiraUrl?: string
  status: TestStatus
  env: TestEnv
  notes?: string
  evidence?: { type: string, url: string, description?: string }[]
}
Response: Test

// PUT /api/tests/:id
// Update test
Body: Partial<Test>
Response: Test

// DELETE /api/tests/:id
// Delete test
Response: { success: boolean }
```

#### Details Endpoints

```typescript
// GET /api/details/:testId
// Get detail file for test
Response: Detail

// POST /api/details
// Create detail file
Body: {
  testId: string
  title: string
  content: string
}
Response: Detail

// PUT /api/details/:testId
// Update detail file
Body: {
  title?: string
  content?: string
}
Response: Detail

// DELETE /api/details/:testId
// Delete detail file
Response: { success: boolean }
```

#### Statistics Endpoint

```typescript
// GET /api/stats
// Get test statistics
Response: {
  total: number
  passed: number
  failed: number
  inProgress: number
  needConfirmation: number
  byEnv: {
    dev: number
    staging: number
    prod: number
  }
  recentTests: Test[] // Last 5 tests
}
```

#### Export/Import Endpoints

```typescript
// POST /api/export
// Export to markdown ZIP
Body: {
  filter?: 'all' | 'active' | 'dateRange' | 'status'
  dateFrom?: string
  dateTo?: string
  status?: TestStatus
}
Response: ZIP file (application/zip)

// POST /api/import
// Import from markdown ZIP
Body: FormData with ZIP file
Query Params:
  - mode: 'replace' | 'merge' | 'skip'
Response: {
  imported: number
  skipped: number
  errors: string[]
}
```

### 3.2 Error Handling

All endpoints return consistent error format:

```typescript
{
  error: string        // Error message
  code: string         // Error code (e.g., "NOT_FOUND", "VALIDATION_ERROR")
  details?: any        // Additional error details
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 404: Not Found
- 500: Internal Server Error

---

## 4. Frontend Design

### 4.1 Component Structure

```
App.vue
├── Layout.vue
│   ├── Header.vue
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── ExportImportButtons
│   └── Main Content (router-view)
│
├── Views/
│   ├── DashboardView.vue
│   │   ├── StatsCards.vue
│   │   ├── RecentTests.vue
│   │   └── QuickActions.vue
│   │
│   ├── TestsView.vue
│   │   ├── TestFilters.vue
│   │   ├── TestTable.vue
│   │   └── TestPagination.vue
│   │
│   ├── TestDetailView.vue
│   │   ├── TestInfo.vue
│   │   ├── EvidenceList.vue
│   │   └── DetailEditor.vue
│   │
│   └── ExportImportView.vue
│       ├── ExportForm.vue
│       └── ImportForm.vue
│
└── Components/
    ├── TestForm.vue (Add/Edit)
    ├── MarkdownEditor.vue
    ├── StatusBadge.vue
    ├── EnvBadge.vue
    └── LoadingSpinner.vue
```

### 4.2 State Management (Pinia)

```typescript
// stores/testStore.ts
export const useTestStore = defineStore('test', {
  state: () => ({
    tests: [] as Test[],
    currentTest: null as Test | null,
    loading: false,
    error: null as string | null,
  }),
  
  actions: {
    async fetchTests(filters?: TestFilters) {
      // GET /api/tests
    },
    
    async fetchTest(id: string) {
      // GET /api/tests/:id
    },
    
    async createTest(data: CreateTestDto) {
      // POST /api/tests
    },
    
    async updateTest(id: string, data: UpdateTestDto) {
      // PUT /api/tests/:id
    },
    
    async deleteTest(id: string) {
      // DELETE /api/tests/:id
    },
  },
  
  getters: {
    activeTests: (state) => state.tests.filter(t => t.status !== 'PASSED'),
    completedTests: (state) => state.tests.filter(t => t.status === 'PASSED'),
  },
})

// stores/detailStore.ts
export const useDetailStore = defineStore('detail', {
  state: () => ({
    details: new Map<string, Detail>(),
    loading: false,
  }),
  
  actions: {
    async fetchDetail(testId: string) {
      // GET /api/details/:testId
    },
    
    async createDetail(data: CreateDetailDto) {
      // POST /api/details
    },
    
    async updateDetail(testId: string, data: UpdateDetailDto) {
      // PUT /api/details/:testId
    },
  },
})

// stores/statsStore.ts
export const useStatsStore = defineStore('stats', {
  state: () => ({
    stats: null as Stats | null,
    loading: false,
  }),
  
  actions: {
    async fetchStats() {
      // GET /api/stats
    },
  },
})
```

### 4.3 Routing

```typescript
// router/index.ts
const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/tests',
    name: 'Tests',
    component: TestsView,
  },
  {
    path: '/tests/:id',
    name: 'TestDetail',
    component: TestDetailView,
  },
  {
    path: '/tests/new',
    name: 'NewTest',
    component: TestForm,
  },
  {
    path: '/export-import',
    name: 'ExportImport',
    component: ExportImportView,
  },
]
```

---

## 5. Backend Design

### 5.1 Project Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── tests.routes.ts
│   │   ├── details.routes.ts
│   │   ├── stats.routes.ts
│   │   └── export.routes.ts
│   │
│   ├── controllers/
│   │   ├── tests.controller.ts
│   │   ├── details.controller.ts
│   │   ├── stats.controller.ts
│   │   └── export.controller.ts
│   │
│   ├── services/
│   │   ├── test.service.ts
│   │   ├── detail.service.ts
│   │   ├── stats.service.ts
│   │   ├── export.service.ts
│   │   └── import.service.ts
│   │
│   ├── utils/
│   │   ├── prisma.ts          # Prisma client instance
│   │   ├── markdown.ts        # Markdown parser (reuse from V1)
│   │   └── validation.ts      # Input validation
│   │
│   ├── types/
│   │   └── index.ts           # Shared types
│   │
│   └── server.ts              # Express app entry point
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                # Optional seed data
│
└── package.json
```

### 5.2 Service Layer Design

```typescript
// services/test.service.ts
export class TestService {
  async getAllTests(filters?: TestFilters): Promise<Test[]> {
    // Build Prisma query with filters
    // Return tests with evidence
  }
  
  async getTestById(id: string): Promise<Test | null> {
    // Get test with evidence and detail
  }
  
  async createTest(data: CreateTestDto): Promise<Test> {
    // Validate data
    // Create test with evidence in transaction
  }
  
  async updateTest(id: string, data: UpdateTestDto): Promise<Test> {
    // Update test and evidence
  }
  
  async deleteTest(id: string): Promise<void> {
    // Delete test (cascades to evidence and detail)
  }
}

// services/export.service.ts
export class ExportService {
  async exportToMarkdown(filters?: ExportFilters): Promise<Buffer> {
    // 1. Get tests from database
    // 2. Generate markdown tables (reuse V1 parser)
    // 3. Generate detail files
    // 4. Create ZIP file
    // 5. Return ZIP buffer
  }
  
  private generateTrackingFile(tests: Test[]): string {
    // Generate QA-2026-Tracking.md
    // Active Tests table
    // Completed Tests Backlog table
  }
  
  private generateDetailFile(detail: Detail): string {
    // Generate detail markdown file
  }
}

// services/import.service.ts
export class ImportService {
  async importFromMarkdown(
    zipBuffer: Buffer,
    mode: 'replace' | 'merge' | 'skip'
  ): Promise<ImportResult> {
    // 1. Extract ZIP file
    // 2. Parse QA-2026-Tracking.md
    // 3. Parse detail files
    // 4. Validate data
    // 5. Import to database based on mode
    // 6. Return import summary
  }
  
  private parseTrackingFile(content: string): Test[] {
    // Reuse V1 markdown parser
  }
  
  private parseDetailFile(content: string): Detail {
    // Parse detail markdown
  }
}
```

---

## 6. Development Workflow

### 6.1 Setup Process

```bash
# 1. Clone/create project
mkdir qa-management-tool-v2
cd qa-management-tool-v2

# 2. Initialize root package.json
npm init -y

# 3. Create frontend
npm create vite@latest frontend -- --template vue-ts
cd frontend
npm install
npm install vue-router pinia axios tailwindcss
cd ..

# 4. Create backend
mkdir backend
cd backend
npm init -y
npm install express prisma @prisma/client cors dotenv
npm install -D typescript @types/express @types/node ts-node nodemon
npx prisma init --datasource-provider sqlite
cd ..

# 5. Install concurrently at root
npm install -D concurrently
```

### 6.2 Running the App

**Root package.json scripts:**

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "start": "cd backend && npm start"
  }
}
```

**Backend package.json scripts:**

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

**Frontend package.json scripts:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 6.3 One-Command Startup

User runs:
```bash
npm run dev
```

This starts:
1. Backend on `http://localhost:3000`
2. Frontend on `http://localhost:5173`
3. Browser opens automatically to frontend

---

## 7. Export/Import Design

### 7.1 Export Flow

```
User clicks "Export" button
  ↓
Frontend sends POST /api/export with filters
  ↓
Backend:
  1. Query tests from database
  2. Generate QA-2026-Tracking.md
     - Active Tests table
     - Completed Tests Backlog table
  3. Generate detail files (test-details/*.md)
  4. Create ZIP file structure:
     ├── QA-2026-Tracking.md
     └── test-details/
         ├── ongoing-february-2026.md
         ├── ongoing-january-2026.md
         └── ...
  5. Return ZIP buffer
  ↓
Frontend downloads ZIP file
```

### 7.2 Import Flow

```
User uploads ZIP file
  ↓
Frontend sends POST /api/import with ZIP
  ↓
Backend:
  1. Extract ZIP to temp directory
  2. Parse QA-2026-Tracking.md
     - Extract Active Tests
     - Extract Completed Tests
  3. Parse detail files
  4. Validate data
  5. Based on mode:
     - Replace: Clear DB, insert all
     - Merge: Update existing, insert new
     - Skip: Only insert new
  6. Return import summary
  ↓
Frontend shows success message
Frontend refreshes test list
```

### 7.3 Markdown Format Compatibility

**Must match V1 format exactly:**

```markdown
## Active Tests

| Date       | Feature               | Jira                                                        | Status | Env     | Evidence                                                                          | Notes                                                          |
| ---------- | --------------------- | ----------------------------------------------------------- | ------ | ------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 2026-02-02 | HRIS - Pengajuan Cuti | [#MD-1871](https://mymedicaid.atlassian.net/browse/MD-1871) | 🟡     | Prod    | [jam.dev](https://jam.dev/c/767324af-d1bb-4426-83b8-9e20965167a0)                 | [[test-details/ongoing-february-2026\|Date Mismatch]]          |
```

**Status emoji mapping:**
- ✅ = PASSED
- 🔴 = FAILED
- 🟡 = IN_PROGRESS
- ❓ = NEED_CONFIRMATION

**Environment mapping:**
- dev = DEV
- staging = STAGING
- prod = PROD

---

## 8. Security Considerations

### 8.1 Input Validation

- Validate all API inputs
- Sanitize markdown content
- Prevent SQL injection (Prisma handles this)
- Validate file uploads (ZIP only, max size)

### 8.2 CORS Configuration

```typescript
// Allow frontend to access backend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
```

### 8.3 Error Handling

- Never expose internal errors to frontend
- Log errors server-side
- Return user-friendly error messages

---

## 9. Performance Optimizations

### 9.1 Database

- Use indexes on frequently queried fields (date, status, feature)
- Lazy load detail files (only fetch when needed)
- Implement pagination for large test lists

### 9.2 Frontend

- Lazy load routes
- Debounce search input
- Cache API responses in Pinia store
- Use virtual scrolling for large tables

### 9.3 Export/Import

- Stream large files instead of loading into memory
- Show progress bar for long operations
- Process in chunks for large datasets

---

## 10. Testing Strategy

### 10.1 Backend Testing

- Unit tests for services
- Integration tests for API endpoints
- Test database operations with test database

### 10.2 Frontend Testing

- Component tests with Vitest
- E2E tests with Playwright (optional)

### 10.3 Manual Testing

- Test all CRUD operations
- Test export with real data
- Test import with existing Obsidian vault
- Test error scenarios

---

## 11. Deployment Options

### 11.1 Local Development

```bash
npm run dev
```

### 11.2 Production Build

```bash
npm run build
npm start
```

### 11.3 Desktop App (Future)

- Package with Electron
- Distribute as standalone app
- No browser needed

---

*Last updated: 2026-02-02*
