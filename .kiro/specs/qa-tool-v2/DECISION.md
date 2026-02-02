# Architecture Decision: Vue.js + Express + Prisma + SQLite

**Date:** 2026-02-02  
**Status:** ✅ Approved  
**Decision:** Build V2 with full-stack architecture

---

## Context

The current V1 tool (React + File System Access API) has critical limitations:

1. ❌ Must reselect folder after every browser refresh
2. ❌ Browser-only architecture (Chrome/Edge only)
3. ❌ Complex markdown parsing causes corruption
4. ❌ Tightly coupled to Obsidian vault
5. ❌ Manual save required
6. ❌ No offline database

**User feedback:** "Not seamless enough"

---

## Decision

Build **V2** with:

- **Frontend:** Vue.js 3 + Vite
- **Backend:** Express.js
- **Database:** Prisma ORM + SQLite
- **Export/Import:** Markdown conversion for Obsidian

---

## Rationale

### Why Full-Stack?

**Problem:** Browser-only architecture is too limited
- File System Access API is browser-specific
- No persistent storage without file access
- Complex file I/O in browser

**Solution:** Backend provides:
- ✅ Full file system access
- ✅ Database for persistent storage
- ✅ Export/Import services
- ✅ Works in all browsers

### Why Vue.js over React?

**Current:** React (V1)

**Proposed:** Vue.js (V2)

**Reasons:**
1. Simpler learning curve
2. Better documentation
3. Smaller bundle size
4. Better TypeScript support
5. Composition API similar to React Hooks
6. Personal preference for this project

**Note:** Both are excellent choices. Vue.js fits better for this use case.

### Why Express over NestJS/Fastify?

**Alternatives considered:**
- NestJS (too complex for this project)
- Fastify (overkill for simple REST API)
- Hono (too new, less ecosystem)

**Chosen:** Express.js

**Reasons:**
1. Simple and straightforward
2. Huge ecosystem
3. Easy to understand
4. Perfect for small-medium apps
5. Well-documented

### Why Prisma over TypeORM/Sequelize?

**Alternatives considered:**
- TypeORM (less modern, complex)
- Sequelize (older, less type-safe)
- Drizzle (too new)

**Chosen:** Prisma

**Reasons:**
1. Best TypeScript support
2. Auto-generated types
3. Great migrations system
4. Excellent DX (developer experience)
5. Modern and actively maintained
6. Great documentation

### Why SQLite over PostgreSQL/MySQL?

**Alternatives considered:**
- PostgreSQL (overkill for local app)
- MySQL (overkill for local app)
- MongoDB (not needed for structured data)

**Chosen:** SQLite

**Reasons:**
1. Zero configuration
2. Single file database (easy backup)
3. Perfect for local apps
4. Fast for small-medium datasets
5. No server needed
6. Easy to migrate to PostgreSQL later if needed

---

## Consequences

### Positive

✅ **Seamless experience**
- No folder selection needed
- Auto-save
- Works in all browsers

✅ **Reliable**
- Database-first (no corruption)
- Transactions for data integrity
- Easy backup (copy database file)

✅ **Fast**
- Instant operations
- No file I/O overhead
- Database queries optimized

✅ **Flexible**
- Export to Obsidian when needed
- Import from Obsidian when needed
- Best of both worlds

✅ **Easy to run**
- One command: `npm run dev`
- Auto-initializes database
- Opens browser automatically

✅ **Maintainable**
- Clean architecture
- Standard REST API
- Easy to extend

### Negative

⚠️ **More complex setup**
- Need Node.js backend
- Need to run two servers (frontend + backend)
- **Mitigation:** Use `concurrently` to run both with one command

⚠️ **Larger bundle size**
- Backend dependencies
- **Mitigation:** SQLite is lightweight, Prisma is tree-shakeable

⚠️ **Not pure browser app**
- Requires Node.js to run
- **Mitigation:** Can package as Electron app later

⚠️ **Learning curve**
- Need to learn Vue.js (if coming from React)
- Need to learn Prisma
- **Mitigation:** Both have excellent documentation

### Neutral

🔄 **Obsidian integration**
- Not direct file access anymore
- Export/Import instead
- **Trade-off:** More reliable, less "live" sync

---

## Alternatives Considered

### Alternative 1: Keep V1, Fix Issues

**Approach:** Improve current React + File System API

**Pros:**
- No rewrite needed
- Keep existing code

**Cons:**
- Can't fix browser limitations
- Can't fix folder selection issue
- Can't fix corruption risk
- Still fragile

**Verdict:** ❌ Not viable

### Alternative 2: React + Express + Prisma

**Approach:** Keep React, add backend

**Pros:**
- Keep React knowledge
- Add backend benefits

**Cons:**
- React is heavier than Vue
- No real advantage over Vue for this project

**Verdict:** ⚠️ Viable but not optimal

### Alternative 3: Vue + Supabase/Firebase

**Approach:** Vue frontend + cloud backend

**Pros:**
- No backend code needed
- Cloud storage

**Cons:**
- Requires internet
- Requires account
- Not local-first
- Overkill for single-user app

**Verdict:** ❌ Not suitable

### Alternative 4: Electron Desktop App

**Approach:** Package V1 as Electron app

**Pros:**
- Full file system access
- No browser limitations

**Cons:**
- Still file-based (corruption risk)
- Larger download size
- More complex distribution

**Verdict:** ⏭️ Future enhancement (after V2)

---

## Decision Outcome

**Chosen:** Vue.js + Express + Prisma + SQLite (V2)

**Reasons:**
1. Solves all V1 limitations
2. Provides seamless experience
3. Reliable and fast
4. Easy to run and maintain
5. Future-proof architecture

**Trade-offs accepted:**
- More complex setup (mitigated with `concurrently`)
- Requires Node.js (acceptable for target users)
- Not pure browser app (can package as Electron later)

---

## Implementation Plan

**Timeline:** 6-8 days for MVP

**Phases:**
1. Setup and Database (Day 1)
2. Core Features (Day 2-3)
3. Detail Files (Day 4)
4. Export/Import (Day 5)
5. Polish and Testing (Day 6)

**Resources:**
- [Requirements](./.kiro/specs/qa-tool-v2/requirements.md)
- [Design](./.kiro/specs/qa-tool-v2/design.md)
- [Tasks](./.kiro/specs/qa-tool-v2/tasks.md)
- [Quick Start](./.kiro/specs/qa-tool-v2/QUICK-START.md)

---

## Success Criteria

**Must Have:**
- ✅ App runs with `npm run dev`
- ✅ All CRUD operations work
- ✅ Export generates valid Obsidian markdown
- ✅ Import successfully migrates data
- ✅ No data loss or corruption

**Nice to Have:**
- ⭐ Search and filter work smoothly
- ⭐ Markdown preview in editor
- ⭐ Export/import < 5 seconds
- ⭐ Intuitive UI

---

## Review and Approval

**Reviewed by:** [Your name]  
**Approved by:** [Your name]  
**Date:** 2026-02-02

**Status:** ✅ Approved - Ready for implementation

---

## References

- [V1 vs V2 Comparison](../../V1-VS-V2-COMPARISON.md)
- [Architecture V2 Proposal](../../ARCHITECTURE-V2-PROPOSAL.md)
- [Requirements Document](./requirements.md)
- [Design Document](./design.md)
- [Implementation Tasks](./tasks.md)

---

**Let's build V2! 🚀**

---

*Last updated: 2026-02-02*
