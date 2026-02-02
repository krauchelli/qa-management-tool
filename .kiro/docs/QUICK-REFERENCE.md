# Quick Reference Guide

**Last Updated:** 2026-02-02

---

## 🚀 Start Application

```bash
cd qa-management-tool
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health: http://localhost:3000/health

---

## 📋 Correct Field Names

### Test Model
```typescript
{
  id: string              // Auto-generated
  date: string            // YYYY-MM-DD format
  feature: string         // Feature name (NOT testName)
  jira?: string           // JIRA ticket number
  jiraUrl?: string        // JIRA ticket URL
  status: TestStatus      // PASSED | FAILED | IN_PROGRESS | NEED_CONFIRMATION
  env: TestEnv            // DEV | STAGING | PROD (NOT PRODUCTION)
  notes?: string          // Optional notes
  detailFile?: string     // Auto-generated when detail created
  createdAt: Date         // Auto-generated
  updatedAt: Date         // Auto-generated
  evidence: Evidence[]    // Array of evidence
  detail?: Detail         // Optional detail (one-to-one)
}
```

### Evidence Model
```typescript
{
  id: string              // Auto-generated
  testId: string          // Foreign key
  type: string            // "screenshot", "jam.dev", "video", etc.
  url: string             // URL or file path
  description?: string    // Optional description
}
```

### Detail Model
```typescript
{
  id: string              // Auto-generated
  testId: string          // Foreign key (unique)
  title: string           // Short title
  content: string         // Full markdown content
  createdAt: Date         // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

---

## 🔧 testStore Methods

### ✅ CORRECT Methods
```typescript
// Get all tests
await testStore.fetchTests()
await testStore.fetchTests({ status: 'PASSED', env: 'PROD' })

// Get single test (sets currentTest)
await testStore.fetchTest(id)
const test = testStore.currentTest

// Create test
await testStore.createTest(data)

// Update test
await testStore.updateTest(id, data)

// Delete test
await testStore.deleteTest(id)

// Filters
testStore.setFilters({ status: 'PASSED' })
testStore.clearFilters()
```

### ❌ WRONG Methods (Don't Use)
```typescript
testStore.fetchTestById()    // Does NOT exist!
testStore.getTest()          // Does NOT exist!
testStore.getTestById()      // Does NOT exist!
```

### State & Getters
```typescript
testStore.tests              // All tests
testStore.currentTest        // Current test (or null)
testStore.loading            // Loading state
testStore.error              // Error message
testStore.activeTests        // Non-PASSED tests
testStore.completedTests     // PASSED tests
testStore.filteredTests      // Filtered tests
```

---

## 🌐 API Endpoints

### Tests
```bash
GET    /api/tests              # Get all tests (with filters)
POST   /api/tests              # Create test
GET    /api/tests/:id          # Get single test
PUT    /api/tests/:id          # Update test
DELETE /api/tests/:id          # Delete test
```

### Evidence
```bash
POST   /api/tests/:id/evidence              # Add evidence
DELETE /api/tests/:testId/evidence/:evidenceId  # Delete evidence
```

### Details
```bash
GET    /api/details/:testId    # Get test details
POST   /api/details            # Create details
PUT    /api/details/:testId    # Update details
DELETE /api/details/:testId    # Delete details
```

### Statistics
```bash
GET    /api/stats              # Get dashboard statistics
```

---

## 📝 Common Patterns

### Create Test
```typescript
await testStore.createTest({
  date: '2026-02-02',
  feature: 'Login Feature',
  jira: 'PROJ-123',
  jiraUrl: 'https://jira.example.com/browse/PROJ-123',
  status: 'PASSED',
  env: 'STAGING',
  notes: 'All scenarios passed'
})
```

### Edit Test (Load Data)
```typescript
// Load test
await testStore.fetchTest(testId)
const test = testStore.currentTest

// Populate form
if (test) {
  form.value = {
    date: test.date,
    feature: test.feature,
    jira: test.jira || '',
    jiraUrl: test.jiraUrl || '',
    env: test.env,
    status: test.status,
    notes: test.notes || ''
  }
}
```

### Add Evidence
```typescript
await testService.addEvidence(testId, {
  type: 'screenshot',
  url: 'https://example.com/image.png',
  description: 'Login page screenshot'
})
```

### Add Details
```typescript
await testService.createDetails({
  testId: testId,
  title: 'Login Test Details',
  content: '## Test Steps\n1. Navigate to login\n2. Enter credentials'
})
```

---

## 🎨 Status & Environment Badges

### Status Values
```typescript
'PASSED'              // Green badge
'FAILED'              // Red badge
'IN_PROGRESS'         // Blue badge
'NEED_CONFIRMATION'   // Yellow badge
```

### Environment Values
```typescript
'DEV'                 // Blue badge
'STAGING'             // Yellow badge
'PROD'                // Red badge
```

---

## 🐛 Common Mistakes to Avoid

### ❌ Wrong
```typescript
// Wrong method name
const test = await testStore.fetchTestById(id)

// Wrong field names
{ testName: 'Test', environment: 'PRODUCTION', testedBy: 'John' }

// Wrong evidence fields
{ description: 'Screenshot', filePath: '/path/to/file' }

// Wrong detail fields
{ testSteps: 'Steps...', expectedResults: 'Results...' }
```

### ✅ Correct
```typescript
// Correct method
await testStore.fetchTest(id)
const test = testStore.currentTest

// Correct field names
{ feature: 'Test', env: 'PROD', jira: 'PROJ-123' }

// Correct evidence fields
{ type: 'screenshot', url: 'https://...', description: 'Screenshot' }

// Correct detail fields
{ title: 'Test Details', content: '## Steps\n1. ...' }
```

---

## 🧪 Testing Commands

### Backend Tests (curl)
```bash
# Health check
curl http://localhost:3000/health

# Get all tests
curl http://localhost:3000/api/tests

# Create test
curl -X POST http://localhost:3000/api/tests \
  -H "Content-Type: application/json" \
  -d '{"date":"2026-02-02","feature":"Test","status":"PASSED","env":"DEV"}'

# Get single test
curl http://localhost:3000/api/tests/{id}
```

### Database
```bash
# View database
cd backend/prisma
sqlite3 dev.db

# SQL queries
SELECT * FROM Test;
SELECT * FROM Evidence;
SELECT * FROM Detail;
```

---

## 📁 Important Files

### Frontend
```
frontend/src/
├── views/
│   ├── DashboardView.vue      # Dashboard with stats
│   ├── TestsView.vue          # Tests list with filters
│   ├── TestFormView.vue       # Create/Edit form
│   └── TestDetailView.vue     # Test detail with evidence & details
├── stores/
│   ├── testStore.ts           # Test state management
│   └── statsStore.ts          # Statistics state
├── services/
│   ├── testService.ts         # API calls
│   └── statsService.ts        # Stats API calls
└── types/
    └── index.ts               # TypeScript types
```

### Backend
```
backend/src/
├── controllers/
│   ├── tests.controller.ts    # Test endpoints
│   ├── details.controller.ts  # Details endpoints
│   └── stats.controller.ts    # Stats endpoint
├── services/
│   ├── test.service.ts        # Test business logic
│   ├── detail.service.ts      # Details business logic
│   └── stats.service.ts       # Stats business logic
├── routes/
│   ├── tests.routes.ts        # Test routes
│   ├── details.routes.ts      # Details routes
│   └── stats.routes.ts        # Stats routes
└── types/
    └── index.ts               # TypeScript types
```

---

## 🔍 Troubleshooting

### Frontend not loading?
```bash
# Check if server is running
curl http://localhost:5173

# Restart frontend
cd frontend
npm run dev
```

### Backend errors?
```bash
# Check backend logs
# Look at the terminal running npm run dev

# Test health endpoint
curl http://localhost:3000/health

# Restart backend
cd backend
npm run dev
```

### Database issues?
```bash
# Reset database
cd backend
npx prisma migrate reset

# Regenerate Prisma client
npx prisma generate
```

### TypeScript errors?
```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

## 📚 Documentation Files

- `README.md` - Project overview
- `QUICK-START.md` - Quick start guide
- `ALL-ISSUES-FIXED.md` - Complete issue resolution log
- `VALIDATION-FIXES.md` - Field name fixes
- `BACKEND-VALIDATION-SUCCESS.md` - Backend test results
- `PHASE-4-COMPLETE.md` - Phase 4 completion details
- `CURRENT-STATUS.md` - Current project status

---

**Need Help?** Check the documentation files above or review the code comments.
