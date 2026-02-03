# QA Management Tool V2 - Feature Planning

**Created:** 2026-02-03  
**Status:** 📋 Planning Phase  
**Priority:** High

---

## Overview

This document outlines 4 major feature enhancements requested for the QA Management Tool V2:

1. **Merge Details with Notes** - Header-based markdown navigation
2. **Tagging System** - Flexible test case grouping
3. **Kanban View Mode** - Visual board view with drag-and-drop
4. **Test Cycles/Versioning** - Track tests across sprints/releases

---

## Feature 1: Merge Details with Notes (Header-Based Navigation)

### Current State
- **Notes:** Simple text field in Test table, shown in table column
- **Details:** Separate Detail table with title + markdown content
- **Problem:** Two separate places for documentation, disconnected

### Proposed Solution

**Unified Details System with Header Navigation:**

1. **Single Markdown Document**
   - Merge notes into details as the first section
   - Use markdown headers (`#`, `##`, `###`) to structure content
   - Auto-generate table of contents from headers

2. **Header Tracking**
   - Parse markdown to extract all headers
   - Store header hierarchy in database
   - Generate navigation sidebar from headers

3. **Smart Notes Column**
   - Table shows first header or first paragraph as "notes"
   - Click to open full details with navigation
   - Edit mode shows full markdown with header highlighting

### Database Changes

```prisma
model Detail {
  id          String   @id @default(cuid())
  testId      String   @unique
  content     String   // Full markdown with headers
  headers     String?  // JSON array of headers: [{level: 1, text: "Overview", id: "overview"}]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  test        Test @relation(fields: [testId], references: [id], onDelete: Cascade)
}

// Remove notes field from Test table
model Test {
  // ... existing fields
  notes       String?  // REMOVE THIS
  // ... rest of fields
}
```

### UI Changes

**Test Table:**
- Notes column shows first header or first 100 chars
- Click opens detail view with navigation

**Detail View:**
- Left sidebar: Header navigation tree
- Main area: Markdown editor with preview
- Click header in nav to jump to section
- Headers are clickable anchors

**Markdown Editor (Toast UI Editor):**
- Native markdown support (no HTML conversion)
- WYSIWYG mode + Markdown mode (toggle)
- Live preview built-in
- Toolbar with header buttons (H1, H2, H3)
- Syntax highlighting for code blocks
- Auto-save on edit
- Perfect for Obsidian compatibility

### Toast UI Editor Configuration

```typescript
// Toast UI Editor setup
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';

{
  initialEditType: 'wysiwyg', // or 'markdown'
  previewStyle: 'vertical',   // side-by-side preview
  height: '500px',
  usageStatistics: false,
  toolbarItems: [
    ['heading', 'bold', 'italic', 'strike'],
    ['hr', 'quote'],
    ['ul', 'ol', 'task'],
    ['table', 'link', 'image'],
    ['code', 'codeblock']
  ],
  autofocus: false,
  placeholder: 'Enter test details in markdown...'
}
```

### Implementation Complexity
- **Backend:** Medium (markdown parsing, header extraction)
- **Frontend:** Medium (Toast UI integration, navigation tree, scroll-to-section)
- **Estimated Time:** 2-3 days

---

## Feature 2: Tagging System

### Current State
- No way to group or categorize tests
- Hard to find related tests (e.g., all regression tests)
- No way to filter by test type (positive, negative, edge case)

### Proposed Solution

**Flexible Tagging System:**

1. **Tag Model**
   - Tags are reusable across tests
   - Color-coded for visual distinction
   - Predefined + custom tags

2. **Common Tag Categories**
   - **Test Type:** `#positive-case`, `#negative-case`, `#edge-case`, `#regression`
   - **Feature Area:** `#authentication`, `#payment`, `#dashboard`, `#api`
   - **Priority:** `#critical`, `#high`, `#medium`, `#low`
   - **Sprint:** `#sprint-1`, `#sprint-2`, `#release-1.0`

3. **Tag Management**
   - Create tags on-the-fly while editing test
   - Autocomplete from existing tags
   - Manage tags in settings (rename, delete, merge)

### Database Changes

```prisma
model Tag {
  id          String    @id @default(cuid())
  name        String    @unique  // e.g., "regression", "positive-case"
  color       String    @default("#3B82F6")  // Hex color
  category    String?   // e.g., "test-type", "feature", "priority"
  createdAt   DateTime  @default(now())
  
  tests       TestTag[]
  
  @@index([name])
}

model TestTag {
  id          String   @id @default(cuid())
  testId      String
  tagId       String
  createdAt   DateTime @default(now())
  
  test        Test @relation(fields: [testId], references: [id], onDelete: Cascade)
  tag         Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@unique([testId, tagId])
  @@index([testId])
  @@index([tagId])
}

model Test {
  // ... existing fields
  tags        TestTag[]
  // ... rest of fields
}
```

### UI Changes

**Test Table:**
- Tag column shows colored badges
- Click tag to filter by that tag
- Multi-tag filter (AND/OR logic)

**Test Form:**
- Tag input with autocomplete
- Create new tags inline
- Color picker for new tags
- Remove tags with X button

**Filters:**
- Tag filter dropdown (multi-select)
- Show tag count next to each tag
- "Show all tests with tag X" button

**Tag Management Page:**
- List all tags with usage count
- Edit tag name and color
- Merge duplicate tags
- Delete unused tags

### API Endpoints

```
GET    /api/tags                    # Get all tags
POST   /api/tags                    # Create tag
PUT    /api/tags/:id                # Update tag
DELETE /api/tags/:id                # Delete tag
POST   /api/tests/:testId/tags      # Add tag to test
DELETE /api/tests/:testId/tags/:tagId  # Remove tag from test
```

### Implementation Complexity
- **Backend:** Medium (junction table, tag CRUD)
- **Frontend:** Medium (autocomplete, multi-select, badges)
- **Estimated Time:** 2-3 days

---

## Feature 3: Kanban View Mode

### Current State
- Only table view available
- Hard to visualize test workflow
- No drag-and-drop status updates

### Proposed Solution

**Kanban Board View:**

1. **Board Layout**
   - Columns: PASSED, FAILED, IN_PROGRESS, NEED_CONFIRMATION
   - Cards: Test cards with key info
   - Drag-and-drop to change status

2. **Card Content**
   - Feature name (title)
   - Date and environment badges
   - Tag badges
   - Evidence count indicator
   - Jira link icon

3. **View Toggle**
   - Button to switch between Table and Kanban
   - Persist view preference in localStorage
   - Same filters apply to both views

4. **Drag-and-Drop**
   - Drag card to different column
   - Auto-update status in database
   - Show loading state during update
   - Undo option (toast notification)

### Database Changes

**No database changes needed!** Status is already in Test table.

### UI Changes

**View Toggle:**
- Button in header: "Table View" | "Kanban View"
- Icon indicators (table icon, board icon)

**Kanban Board:**
- 4 columns (one per status)
- Scrollable columns if many tests
- Card shows:
  - Feature name
  - Date
  - Environment badge
  - Tags
  - Evidence count
  - Jira link
- Click card to open detail view
- Drag card to change status

**Responsive Design:**
- Desktop: 4 columns side-by-side
- Tablet: 2 columns, scroll horizontally
- Mobile: 1 column, dropdown to switch status

### Libraries

**Drag-and-Drop:**
- Use `@vueuse/core` (useDraggable, useDropZone)
- Or `vue-draggable-next` (Vue 3 compatible)
- Or native HTML5 drag-and-drop API

**Markdown Editor:**
- Toast UI Editor for native markdown editing
- `@toast-ui/vue-editor` for Vue 3 integration
- `@toast-ui/editor` core library
- No conversion libraries needed (pure markdown)

### Implementation Complexity
- **Backend:** None (uses existing API)
- **Frontend:** Medium-High (drag-and-drop, card layout)
- **Estimated Time:** 2-3 days

---

## Feature 4: Test Cycles/Versioning

### Current State
- Tests are flat, no grouping by sprint/release
- Hard to track "same test, different sprint"
- No way to see test history over time
- Manual date editing for tracking

### Proposed Solution

**Test Cycles with History Tracking:**

1. **Test Cycle Model**
   - Represents a sprint, release, or testing period
   - Has start/end dates
   - Groups tests together
   - Can be marked as active or archived

2. **Test History**
   - Track test results over multiple cycles
   - See how test status changed over time
   - Compare results across cycles

3. **Cycle Management**
   - Create new cycle (e.g., "Sprint 5", "Release 1.2")
   - Assign tests to cycle
   - Close cycle when done
   - View archived cycles

### Database Changes

```prisma
model TestCycle {
  id          String    @id @default(cuid())
  name        String    // e.g., "Sprint 5", "Release 1.2"
  description String?
  startDate   String    // YYYY-MM-DD
  endDate     String?   // YYYY-MM-DD (null if ongoing)
  status      String    @default("ACTIVE")  // ACTIVE, COMPLETED, ARCHIVED
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  tests       Test[]
  
  @@index([status])
  @@index([startDate])
}

model Test {
  // ... existing fields
  cycleId     String?
  cycle       TestCycle? @relation(fields: [cycleId], references: [id], onDelete: SetNull)
  // ... rest of fields
  
  @@index([cycleId])
}

model TestHistory {
  id          String    @id @default(cuid())
  testId      String
  cycleId     String
  status      String    // Status at that time
  date        String    // Test date
  notes       String?   // Notes at that time
  createdAt   DateTime  @default(now())
  
  @@index([testId])
  @@index([cycleId])
  @@index([date])
}
```

### UI Changes

**Cycle Selector:**
- Dropdown in header: "Current Cycle: Sprint 5"
- Shows active cycle by default
- Can switch to view other cycles
- "All Tests" option to see everything

**Cycle Management Page:**
- List all cycles (active, completed, archived)
- Create new cycle button
- Edit cycle details
- Close/archive cycle
- View cycle statistics

**Test Form:**
- Cycle dropdown (optional)
- Auto-assign to active cycle
- Can change cycle later

**Test History View:**
- Timeline view of test results
- Show status changes over cycles
- Compare results across cycles
- Export history report

**Dashboard:**
- Cycle statistics
- Trend charts (pass rate over cycles)
- Cycle comparison

### API Endpoints

```
GET    /api/cycles                  # Get all cycles
GET    /api/cycles/:id              # Get cycle details
POST   /api/cycles                  # Create cycle
PUT    /api/cycles/:id              # Update cycle
DELETE /api/cycles/:id              # Delete cycle
GET    /api/cycles/:id/tests        # Get tests in cycle
GET    /api/cycles/:id/stats        # Get cycle statistics
GET    /api/tests/:id/history       # Get test history
```

### Implementation Complexity
- **Backend:** Medium-High (new models, history tracking)
- **Frontend:** Medium-High (cycle UI, history timeline)
- **Estimated Time:** 3-4 days

---

## Recommended Implementation Order

### Option A: Feature-by-Feature (Recommended)
Implement one complete feature at a time:

1. **Phase 1: Tagging System** (2-3 days)
   - Most impactful for current workflow
   - Enables better organization immediately
   - Foundation for other features

2. **Phase 2: Kanban View** (2-3 days)
   - Visual improvement
   - Better workflow management
   - Uses existing data (no migration)

3. **Phase 3: Merge Details with Notes** (2-3 days)
   - Improves documentation workflow
   - Better navigation
   - Requires data migration

4. **Phase 4: Test Cycles** (3-4 days)
   - Most complex feature
   - Builds on tagging system
   - Enables long-term tracking

**Total Time: 9-13 days**

### Option B: Parallel Development
Implement multiple features simultaneously:

1. **Week 1:** Tagging + Kanban (can be done in parallel)
2. **Week 2:** Details Merge + Test Cycles

**Total Time: 2 weeks**

### Option C: MVP First
Implement minimal versions of all features:

1. **Day 1-2:** Basic tagging (no management UI)
2. **Day 3-4:** Basic kanban (no drag-and-drop)
3. **Day 5-6:** Basic details merge (no navigation)
4. **Day 7-8:** Basic cycles (no history)
5. **Day 9-10:** Polish and complete features

**Total Time: 10 days**

---

## Database Migration Strategy

### For Tagging System
- Create Tag and TestTag tables
- No data migration needed (start fresh)

### For Details Merge
- Migrate notes field to details content
- For tests with both notes and details:
  - Prepend notes as first section
  - Add "## Notes" header
- Parse headers and store in JSON

### For Test Cycles
- Create TestCycle table
- Create default cycle "Uncategorized"
- Assign all existing tests to default cycle
- User can reassign later

### Migration Script Template

```typescript
// prisma/migrations/add-tagging-system.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  console.log('Starting migration...');
  
  // Create default tags
  const defaultTags = [
    { name: 'regression', color: '#EF4444', category: 'test-type' },
    { name: 'positive-case', color: '#10B981', category: 'test-type' },
    { name: 'negative-case', color: '#F59E0B', category: 'test-type' },
    { name: 'edge-case', color: '#8B5CF6', category: 'test-type' },
  ];
  
  for (const tag of defaultTags) {
    await prisma.tag.create({ data: tag });
  }
  
  console.log('Migration complete!');
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## Risk Assessment

### Feature 1: Details Merge
- **Risk:** Data loss during migration
- **Mitigation:** Backup database before migration, test on copy first
- **Risk:** Complex markdown parsing
- **Mitigation:** Use proven library (marked.js, remark)

### Feature 2: Tagging
- **Risk:** Tag explosion (too many tags)
- **Mitigation:** Tag management UI, merge duplicates
- **Risk:** Performance with many tags
- **Mitigation:** Database indexes, pagination

### Feature 3: Kanban
- **Risk:** Drag-and-drop bugs
- **Mitigation:** Use proven library, extensive testing
- **Risk:** Mobile UX challenges
- **Mitigation:** Responsive design, touch-friendly

### Feature 4: Test Cycles
- **Risk:** Complex data model
- **Mitigation:** Start simple, iterate
- **Risk:** History tracking overhead
- **Mitigation:** Async history creation, indexes

---

## Success Metrics

### Feature 1: Details Merge
- ✅ All notes migrated successfully
- ✅ Header navigation works smoothly
- ✅ No data loss

### Feature 2: Tagging
- ✅ Can create and assign tags
- ✅ Filter by tags works
- ✅ Tag management UI functional

### Feature 3: Kanban
- ✅ Drag-and-drop updates status
- ✅ View toggle works
- ✅ Responsive on all devices

### Feature 4: Test Cycles
- ✅ Can create and manage cycles
- ✅ Tests assigned to cycles
- ✅ History tracking works
- ✅ Cycle statistics accurate

---

## Next Steps

1. **User Decision:** Choose implementation order (Option A, B, or C)
2. **Create Detailed Specs:** For chosen feature(s)
3. **Update Prisma Schema:** Add new models
4. **Create Migration Scripts:** For data migration
5. **Implement Backend:** API endpoints and services
6. **Implement Frontend:** UI components and views
7. **Test Thoroughly:** Manual and automated testing
8. **Deploy:** Update production database

---

## Questions for User

1. **Which feature should we implement first?**
   - Tagging (most impactful for organization)
   - Kanban (visual improvement)
   - Details Merge (better documentation)
   - Test Cycles (long-term tracking)

2. **Implementation approach?**
   - Option A: One feature at a time (safer)
   - Option B: Parallel development (faster)
   - Option C: MVP first (quickest to see all features)

3. **For Test Cycles:**
   - Manual date editing OR automatic versioning?
   - Sprint-based OR release-based OR both?
   - How to handle "same test, different cycle"?

4. **For Tagging:**
   - Predefined tags only OR allow custom tags?
   - Tag categories (test-type, feature, priority) OR flat structure?

5. **For Details Merge:**
   - Keep notes field as fallback OR fully migrate?
   - Auto-generate headers OR manual only?

6. **✅ Editor Choice: DECIDED**
   - ✅ Toast UI Editor (native markdown support)
   - See: `TOAST-UI-EDITOR.md` for implementation guide
   - See: `EDITOR-DECISION.md` for decision rationale

---

**Status:** 📋 Awaiting User Decision on Feature Priority  
**Created:** 2026-02-03  
**Updated:** 2026-02-03  
**Next Action:** User chooses feature and implementation order

