# QA Management Tool V2 - Spec Overview

**Architecture:** Vue.js + Express + Prisma + SQLite  
**Status:** 📋 Ready for Implementation  
**Created:** 2026-02-02

---

## What is This?

This is a complete specification for building a **database-first QA management tool** that solves all the limitations of V1:

- ✅ No more folder selection after refresh
- ✅ No more markdown corruption
- ✅ Seamless, fast, reliable
- ✅ Export to Obsidian when needed
- ✅ Import from existing Obsidian vault
- ✅ Runs with one command: `npm run dev`

---

## Spec Documents

### 1. [Requirements](./requirements.md)
**What we're building and why**

- Problem statement
- User stories (15 stories)
- Acceptance criteria (detailed)
- Technical requirements
- Success metrics

**Read this first** to understand the full scope.

### 2. [Design](./design.md)
**How we're building it**

- System architecture
- Database schema (Prisma)
- API design (REST endpoints)
- Frontend design (Vue components)
- Backend design (Express services)
- Export/Import flow
- Development workflow

**Read this second** to understand the technical approach.

### 3. [Tasks](./tasks.md)
**Step-by-step implementation plan**

- 11 phases
- 150+ tasks
- Organized by feature
- Estimated 6-8 days for MVP

**Use this** to track implementation progress.

### 4. [Quick Start](./QUICK-START.md)
**How to run the app once built**

- Installation instructions
- Running the app (one command!)
- Using the app
- Troubleshooting
- Tips and tricks

**Share this** with users once the app is ready.

---

## Key Features

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
- ✅ Multiple export options (all, active, date range, status)
- ✅ Conflict resolution (replace, merge, skip)
- ✅ ZIP file download

### Easy to Run
- ✅ One command: `npm run dev`
- ✅ Auto-initializes database
- ✅ Opens browser automatically
- ✅ Hot reload for development

---

## Technology Stack

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
- Concurrently (run both servers)
- Nodemon (auto-restart)
- ESLint + Prettier (code quality)

---

## Project Structure

```
qa-management-tool-v2/
├── frontend/                 # Vue.js app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── views/           # Page views
│   │   ├── stores/          # Pinia stores
│   │   ├── services/        # API service layer
│   │   └── App.vue
│   └── package.json
│
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── dev.db           # SQLite database
│   └── package.json
│
├── package.json              # Root package (scripts)
└── README.md
```

---

## Implementation Timeline

**Phase 1:** Setup and Database (Day 1)
- Project structure
- Prisma schema
- Express skeleton
- Vue skeleton

**Phase 2:** Core Features (Day 2-3)
- CRUD operations
- Test table
- Forms
- Dashboard

**Phase 3:** Detail Files (Day 4)
- Detail CRUD
- Markdown editor
- Link to tests

**Phase 4:** Export/Import (Day 5)
- Export service
- Import service
- ZIP handling
- UI

**Phase 5:** Polish (Day 6)
- Error handling
- Loading states
- Documentation
- Testing

**Total: 6-8 days for MVP**

---

## How to Use This Spec

### For Implementation

1. **Read requirements.md** - Understand what we're building
2. **Read design.md** - Understand how we're building it
3. **Follow tasks.md** - Implement step by step
4. **Test as you go** - Don't wait until the end
5. **Update docs** - Keep README and QUICK-START updated

### For Review

1. Check that requirements are complete
2. Verify design makes sense
3. Ensure tasks cover all requirements
4. Validate technical decisions
5. Suggest improvements

### For Users

1. Share QUICK-START.md once app is ready
2. Provide support based on troubleshooting section
3. Gather feedback for improvements
4. Plan future enhancements

---

## Success Criteria

**Must Have (MVP):**
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

## Advantages Over V1

| Feature | V1 (Current) | V2 (New) |
|---------|-------------|----------|
| **Storage** | Markdown files | SQLite database |
| **Folder Selection** | Every refresh | Never |
| **Save** | Manual button | Auto-save |
| **Corruption Risk** | High | None |
| **Offline** | Requires vault | Always works |
| **Search** | Basic | Full-text |
| **Performance** | Slow (file I/O) | Fast (database) |
| **Reliability** | Fragile | Robust |
| **Setup** | Complex | One command |
| **Obsidian Sync** | Direct | Export/Import |

---

## Future Enhancements

**Not in MVP, but possible later:**
- User authentication
- Real-time collaboration
- Cloud sync
- Mobile app
- Advanced analytics
- Automated testing integration
- Electron desktop app
- Dark mode
- Keyboard shortcuts
- Undo/redo
- Bulk operations

---

## Questions?

**Technical Questions:**
- Check design.md for architecture details
- Check tasks.md for implementation steps

**User Questions:**
- Check QUICK-START.md for usage instructions
- Check requirements.md for feature details

**Other Questions:**
- Review all spec documents
- Check troubleshooting sections
- Consult with team

---

## Next Steps

1. ✅ Review this spec
2. ✅ Approve requirements
3. ✅ Approve design
4. ⏭️ Start implementation (Phase 1)
5. ⏭️ Test as you build
6. ⏭️ Deploy and share!

---

**Ready to build? Let's go! 🚀**

---

*Last updated: 2026-02-02*
