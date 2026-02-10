# Test Case Library - Implementation Spec

**Feature:** Test Case Library dengan Tag-Based Reference  
**Status:** 🚧 Ready for Implementation  
**Priority:** High  
**Estimated Time:** 5-7 days

---

## Overview

Implement **Test Case Library** sebagai repository of reusable test cases yang terpisah dari test tracking (test execution). Test cases bound ke tagging system untuk easy reference dan reusability across cycles.

**Key Concept:**
- **Test Case** = Template (what to test) - reusable
- **Test Tracking** = Execution (result) - specific to cycle/date
- **Tags** = Bridge between test cases and test tracking

---

## Database Schema

### New Models

```prisma
model TestCase {
  id          String    @id @default(cuid())
  title       String    // e.g., "Login with valid credentials"
  description String?   // Brief description
  steps       String    // Test steps (markdown)
  expected    String    // Expected results (markdown)
  priority    String    @default("MEDIUM")  // LOW, MEDIUM, HIGH, CRITICAL
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  tags        TestCaseTag[]
  executions  Test[]    // Test trackings that reference this test case
  
  @@index([title])
  @@index([priority])
}

model TestCaseTag {
  id          String   @id @default(cuid())
  testCaseId  String
  tagId       String
  createdAt   DateTime @default(now())
  
  testCase    TestCase @relation(fields: [testCaseId], references: [id], onDelete: Cascade)
  tag         Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@unique([testCaseId, tagId])
  @@index([testCaseId])
  @@index([tagId])
}
```

### Updated Models

```prisma
model Test {
  // ... existing fields
  testCaseId  String?   // Reference to test case (optional)
  testCase    TestCase? @relation(fields: [testCaseId], references: [id], onDelete: SetNull)
  // ... rest of fields
  
  @@index([testCaseId])
}

model Tag {
  // ... existing fields
  testCases   TestCaseTag[]  // Add this
  // ... rest of fields
}
```

---

## UI/UX Design

### 1. Test Case Library Page (`/test-cases`)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Test Case Library                          [+ New Test Case]│
├─────────────────────────────────────────────────────────────┤
│ [Search...] [Priority ▼] [Tags ▼] [Sort ▼]        [Clear]  │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔵 Login with valid credentials          [CRITICAL]     │ │
│ │ Tags: #authentication #positive-case                    │ │
│ │ Used in 3 tests | Last used: 2026-02-01                 │ │
│ │ [View] [Edit] [Use in Test] [Delete]                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🟡 Login with invalid password           [HIGH]         │ │
│ │ Tags: #authentication #negative-case                    │ │
│ │ Used in 2 tests | Last used: 2026-01-28                 │ │
│ │ [View] [Edit] [Use in Test] [Delete]                    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Card-based layout (not table) for better readability
- Priority indicator (color-coded)
- Tag badges
- Usage statistics (how many times used)
- Quick actions: View, Edit, Use in Test, Delete

### 2. Test Case Form (`/test-cases/new`, `/test-cases/:id/edit`)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Create Test Case                                   [Cancel] │
├─────────────────────────────────────────────────────────────┤
│ Title *                                                      │
│ [Login with valid credentials                            ]  │
│                                                              │
│ Description (optional)                                       │
│ [Verify that users can login with correct credentials   ]  │
│                                                              │
│ Priority *                                                   │
│ [CRITICAL ▼]                                                 │
│                                                              │
│ Tags *                                                       │
│ [#authentication] [#positive-case] [+ Add tag]              │
│                                                              │
│ Test Steps * (Markdown supported)                           │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ 1. Open login page                                       ││
│ │ 2. Enter valid email: user@example.com                   ││
│ │ 3. Enter valid password: ********                        ││
│ │ 4. Click "Login" button                                  ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ Expected Results * (Markdown supported)                      │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ - User is logged in successfully                         ││
│ │ - Redirected to dashboard                                ││
│ │ - Welcome message displayed                              ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ [Save Test Case]                                             │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Simple form with markdown support for steps & expected
- Tag selector (same as test tracking)
- Priority dropdown
- Validation: title, steps, expected are required

### 3. Test Case Detail View (`/test-cases/:id`)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Library                                            │
│                                                              │
│ Login with valid credentials                    [CRITICAL]  │
│ Tags: #authentication #positive-case                         │
│                                                              │
│ [Edit] [Use in Test] [Delete]                               │
├─────────────────────────────────────────────────────────────┤
│ Description                                                  │
│ Verify that users can login with correct credentials        │
│                                                              │
│ Test Steps                                                   │
│ 1. Open login page                                           │
│ 2. Enter valid email: user@example.com                       │
│ 3. Enter valid password: ********                            │
│ 4. Click "Login" button                                      │
│                                                              │
│ Expected Results                                             │
│ - User is logged in successfully                             │
│ - Redirected to dashboard                                    │
│ - Welcome message displayed                                  │
├─────────────────────────────────────────────────────────────┤
│ Execution History (3 tests)                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 2026-02-01 | DEV | ✅ PASSED | Sprint 3                 │ │
│ │ 2026-01-15 | STAGING | ❌ FAILED | Sprint 2             │ │
│ │ 2026-01-01 | DEV | ✅ PASSED | Sprint 1                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Statistics                                                   │
│ - Total executions: 3                                        │
│ - Pass rate: 66.7% (2/3)                                     │
│ - Last tested: 2026-02-01                                    │
│ - Created: 2025-12-15                                        │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Full test case details
- Execution history (list of test trackings that used this test case)
- Statistics (pass rate, last tested, etc)
- Quick actions: Edit, Use in Test, Delete

### 4. Enhanced Test Tracking Form

**Add "Select from Test Case Library" option:**

```
┌─────────────────────────────────────────────────────────────┐
│ Create Test Tracking                                         │
├─────────────────────────────────────────────────────────────┤
│ ○ Create from scratch                                        │
│ ● Select from Test Case Library                              │
│                                                              │
│ Search Test Cases                                            │
│ [Search by title or tags...                              ]  │
│                                                              │
│ Filter by Tags                                               │
│ [#authentication] [#positive-case] [Clear]                   │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔵 Login with valid credentials          [CRITICAL]     │ │
│ │ Tags: #authentication #positive-case                    │ │
│ │ [Select]                                                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🟡 Login with invalid password           [HIGH]         │ │
│ │ Tags: #authentication #negative-case                    │ │
│ │ [Select]                                                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [Cancel]                                                     │
└─────────────────────────────────────────────────────────────┘
```

**After selecting test case:**
```
┌─────────────────────────────────────────────────────────────┐
│ Create Test Tracking                                         │
├─────────────────────────────────────────────────────────────┤
│ Based on Test Case: Login with valid credentials [View]     │
│                                                              │
│ Date *                                                       │
│ [2026-02-04]                                                 │
│                                                              │
│ Environment *                                                │
│ [DEV ▼]                                                      │
│                                                              │
│ Status *                                                     │
│ [IN_PROGRESS ▼]                                              │
│                                                              │
│ Jira Ticket (optional)                                       │
│ [MM-123]                                                     │
│                                                              │
│ Tags (inherited from test case)                              │
│ [#authentication] [#positive-case] [+ Add more]              │
│                                                              │
│ Evidence                                                     │
│ [+ Add Evidence]                                             │
│                                                              │
│ Notes (optional)                                             │
│ [Additional notes for this execution...                   ]  │
│                                                              │
│ [Save Test]                                                  │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Two modes: Create from scratch OR Select from library
- Search & filter test cases by tags
- Auto-fill feature name, tags from test case
- Still need to fill: date, env, status, evidence
- Link back to test case

---

## API Endpoints

### Test Case CRUD

```
GET    /api/test-cases              # Get all test cases (with filters)
GET    /api/test-cases/:id          # Get test case details
POST   /api/test-cases              # Create test case
PUT    /api/test-cases/:id          # Update test case
DELETE /api/test-cases/:id          # Delete test case
```

### Test Case Tags

```
POST   /api/test-cases/:id/tags     # Add tag to test case
DELETE /api/test-cases/:id/tags/:tagId  # Remove tag from test case
```

### Test Case Statistics

```
GET    /api/test-cases/:id/executions  # Get execution history
GET    /api/test-cases/:id/stats       # Get statistics (pass rate, etc)
```

### Test Tracking Enhancement

```
POST   /api/tests                    # Enhanced: accept testCaseId
PUT    /api/tests/:id                # Enhanced: can update testCaseId
```

---

## Implementation Plan

### Phase 1: Database & Backend (2-3 days)

**Day 1: Database Setup**
- [ ] Update Prisma schema (TestCase, TestCaseTag models)
- [ ] Create migration
- [ ] Update Tag model to include testCases relation
- [ ] Update Test model to include testCaseId

**Day 2: Backend Services**
- [ ] Create `testCase.service.ts` (CRUD operations)
- [ ] Create `testCase.controller.ts` (request handlers)
- [ ] Create routes `/api/test-cases`
- [ ] Add tag management for test cases
- [ ] Add execution history endpoint

**Day 3: Backend Testing**
- [ ] Test all endpoints with Postman/Thunder Client
- [ ] Verify tag relationships work
- [ ] Verify test tracking can reference test case

### Phase 2: Frontend Core (2-3 days)

**Day 4: Test Case Library Page**
- [ ] Create `TestCaseLibraryView.vue`
- [ ] Create `TestCaseCard.vue` component
- [ ] Implement search & filter
- [ ] Add to router (`/test-cases`)
- [ ] Add navigation link in App.vue

**Day 5: Test Case Form**
- [ ] Create `TestCaseFormView.vue`
- [ ] Implement form with validation
- [ ] Integrate TagSelector component
- [ ] Add markdown editor for steps & expected
- [ ] Add to router (`/test-cases/new`, `/test-cases/:id/edit`)

**Day 6: Test Case Detail View**
- [ ] Create `TestCaseDetailView.vue`
- [ ] Display test case details
- [ ] Show execution history
- [ ] Show statistics
- [ ] Add quick actions (Edit, Use in Test, Delete)

### Phase 3: Integration (1-2 days)

**Day 7: Enhance Test Tracking Form**
- [ ] Add "Select from Test Case Library" mode
- [ ] Create test case selector component
- [ ] Implement search & filter in selector
- [ ] Auto-fill form when test case selected
- [ ] Save testCaseId when creating test

**Day 8: Polish & Testing**
- [ ] Test full workflow (create test case → use in test → view history)
- [ ] Fix bugs
- [ ] Add loading states
- [ ] Add error handling
- [ ] Update documentation

---

## Common UI Patterns for Test Case Management

Based on industry standards (TestRail, Zephyr, qTest), here are common patterns:

### 1. **Card-Based Layout** (Recommended)
- Better for browsing and scanning
- Shows more context (tags, stats, description)
- Easier to add quick actions
- More visual (priority colors, icons)

### 2. **Table Layout** (Alternative)
- Better for large datasets
- Easier to sort and filter
- More compact
- Good for power users

### 3. **Folder/Tree Structure** (Not Recommended for Now)
- Complex to implement
- Overkill for small datasets
- Tags provide better flexibility

**Recommendation:** Start with **Card-Based Layout** for test case library, keep **Table Layout** for test tracking.

---

## Priority Colors

```
CRITICAL: 🔴 Red (#EF4444)
HIGH:     🟠 Orange (#F59E0B)
MEDIUM:   🟡 Yellow (#EAB308)
LOW:      🟢 Green (#10B981)
```

---

## Success Criteria

- [ ] Can create test case with title, steps, expected, priority, tags
- [ ] Can view all test cases in library (card layout)
- [ ] Can search & filter test cases by title, priority, tags
- [ ] Can edit & delete test cases
- [ ] Can select test case when creating test tracking
- [ ] Test tracking auto-fills from test case
- [ ] Can view execution history in test case detail
- [ ] Statistics show correct pass rate
- [ ] Tags work correctly for both test cases and test tracking

---

## Next Steps

1. Review this spec
2. Confirm UI/UX design
3. Start Phase 1 (Database & Backend)
4. Iterate based on feedback

