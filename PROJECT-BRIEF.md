# QA Management Tool - Project Brief

**Status:** ✅ POC Complete  
**Version:** -  
**Created:** February 2026  
**Author:** Personal Project - MyMedica Internship

---

## 📋 Executive Summary

Project ini merupakan **Proof of Concept (POC)** dari QA Management Tool yang disusun sebagai personal project selama internship di MyMedica sebagai QA Engineer. Tool ini dibuat untuk mengatasi pain points yang dialami selama proses testing, sekaligus sebagai bentuk pembelajaran dan evaluasi diri tentang workflow QA yang seharusnya.

Lebih dari sekedar membuat tools, project ini juga menjadi wadah buatku untuk mengevaluasi ulang seperti apa yang harus dilakukan sebagai QA Engineer yang baik, serta menyalurkan minat pribadi di aspek IT development secara lebih luas—tidak hanya di full-stack, tapi di seluruh bentuk development.

---

## 🎯 Background & Motivation

### Alasan Utama (Personal)

Selama internship di MyMedica, pada awalnya ada **backlog QA** dari pihak MyMedica yang sebenernya bisa dilanjutkan, seperti google spreadsheet dan juga Browserstack yang telah di-assign oleh Mas Irwan. Tetapi seiring berjalannya waktu, purpose dari test cases yang ingin secara teknis dilanjutkan **berakhir menjadi test tracker yang alakadarnya**, dengan fair reason kalau banyak feature yang diimplementasikan dalam waktu yang cepat dan brief.

**Masalahnya:**

- Test tracker belum tersimpan atau synced dengan test case yang sudah tersedia
- Tidak ada planning yang jelas untuk test case management
- Tools yang ada terlalu kompleks atau terikat paywall

Dari sini, muncul keinginan untuk membenah workflow pribadi. Jikalau kedepannya ada yang menginginkan dokumentasi test track maupun test case yang lebih proper, sistem ini bisa digunakan untuk **laporan yang lebih tanggap dan mudah diakses**. Bonus point: bisa diadaptasi dengan AI assistance dari Kiro yang sudah disediakan MyMedica (thank you for the access! 🙏).

### Pain Points yang Dialami

#### 1. **Existing Tools (BrowserStack, dll)**

- ❌ **Terikat paywall** - fitur lengkap butuh subscription mahal (ini alasan yang sebenarnya tidak perlu aku sebut karena sudah masuk ke dalam implementasi juga sebelumnya)
- ❌ **Kompleks untuk diadaptasi** - learning curve tinggi
- ❌ **Export/Import Excel ribet** - format tidak fleksibel
- ❌ **Tidak customizable** - harus ikut workflow mereka

#### 2. **Personal Workflow dengan Obsidian**

Selama intern, aku pribadi memutuskan untuk menggunakan Obsidian sebagai rough tracker untuk:

- Track harian dalam pengetesan
- Refer pada satu file utama dalam bentuk list
- Ongoing task diletakkan di kanban

**Masalahnya:**

- ❌ **Manual banget** - harus copy-paste, edit markdown manual
- ❌ **Tidak ada database** - semua di file, susah search
- ❌ **Tidak ada statistics** - harus hitung manual
- ❌ **Tidak ada filtering** - harus scroll cari manual
- ❌ **Tidak ada tagging** - susah grouping test cases
- ❌ **Tidak ada visual board** - kanban manual di Obsidian

Workflow ini functional, tapi tidak scalable. Kalau test cases bertambah banyak atau butuh reporting cepat, jadi bottleneck.

#### 3. **Collaboration & Sharing**

- ❌ **Susah share ke team** - harus export manual
- ❌ **Tidak ada format Discord** - harus convert manual
- ❌ **Tidak ada centralized storage** - tersebar di banyak file

---

## 💡 Solution: QA Management Tool V2

### Konsep Utama

**"Personalized QA tracker dengan Obsidian compatibility"** (Semoga)

Jadi idenya:

1. **Daily work** pakai web app (cepat, ada database, ada UI)
2. **Export ke Obsidian** kalau mau backup atau review di markdown
3. **Best of both worlds** - convenience of web app + flexibility of markdown

Sistem ini dibuat ringan dan portable, bisa run di laptop biasa tanpa perlu server atau cloud infrastructure yang kompleks.

### Tech Stack

**Backend:**

- Node.js + Express.js (REST API)
- Prisma ORM (type-safe database queries)
- SQLite (lightweight, portable database)
- TypeScript (type safety)

**Frontend:**

- Vue.js 3 (reactive UI framework)
- Vite (fast build tool)
- Pinia (state management)
- TailwindCSS (utility-first styling)
- Toast UI Editor (markdown WYSIWYG editor)

**Why this stack?**

- ✅ **Lightweight** - bisa run di laptop biasa
- ✅ **Portable** - database cuma 1 file SQLite
- ✅ **Type-safe** - TypeScript + Prisma = less bugs
- ✅ **Modern** - Vue 3 + Vite = fast development
- ✅ **Easy to learn** - dokumentasi lengkap
- ✅ **Good learning opportunity** - cover berbagai aspek development

---

## ✨ Fitur yang Sudah Terimplementasi

Berikut adalah fitur-fitur yang sudah berhasil diimplementasikan dan dapat dilihat demo-nya di jam.dev:

### 1. **Core Test Management**

- ✅ **CRUD Operations** - Create, Read, Update, Delete tests
- ✅ **Test Fields:**
  - Date (test date)
  - Feature (what's being tested)
  - Jira ticket (optional link)
  - Status (Passed, Failed, In Progress, Need Confirmation)
  - Environment (DEV, STAGING, PROD)
  - Notes (quick notes)
  - Evidence (jam.dev recordings, screenshots, etc)
  - Tags (flexible categorization)

### 2. **Dashboard & Statistics**

- ✅ **Real-time stats:**
  - Total tests
  - Pass/Fail/In Progress/Need Confirmation counts
  - Breakdown by environment
  - Recent tests list
- ✅ **Visual indicators** - color-coded badges

### 3. **Tagging System**

- ✅ **Flexible tags** - create custom tags on-the-fly
- ✅ **Tag categories:**
  - Test Type: `regression`, `positive-case`, `negative-case`, `edge-case`
  - Priority: `critical`, `high`, `medium`, `low`
  - Feature: `authentication`, `api`, `ui`, `database`
- ✅ **Tag management page** - view, edit, delete tags
- ✅ **Usage count** - see how many tests use each tag
- ✅ **Color-coded** - visual distinction

### 4. **Kanban Board View**

- ✅ **Visual workflow** - 4 columns by status
- ✅ **Drag-and-drop** - change status via dropdown on card
- ✅ **Card display:**
  - Feature name
  - Date
  - Environment badge
  - Tags
  - Jira link
  - Evidence count
- ✅ **Toggle view** - switch between Table and Kanban

### 5. **Test Details with Markdown**

- ✅ **Toast UI Editor** - WYSIWYG + Markdown mode
- ✅ **Header-based navigation** - auto-generate TOC from `#`, `##`, `###`
- ✅ **2 input modes:**
  - **Formatted mode** - form fields (Scenario, Steps, Expected, Actual, Root Cause)
  - **Free mode** - full markdown editor
- ✅ **Add details saat create test** - tidak perlu edit lagi
- ✅ **Toast UI Viewer** - read-only display dengan formatting

### 6. **Copy to Clipboard**

- ✅ **Copy as Markdown** - full syntax untuk Obsidian
- ✅ **Copy for Discord** - auto-convert ke Discord format:
  - Headers → `**bold**`
  - Tables → code blocks
  - Preserve: bold, italic, lists, quotes, code

### 7. **Search & Filter**

- ✅ **Search** - by feature, jira, notes
- ✅ **Filter by:**
  - Status
  - Environment
  - Date range
  - Tags (coming soon)
- ✅ **Sort by:**
  - Date
  - Feature
  - Status
  - Environment

### 8. **Evidence Management**

- ✅ **Add multiple evidence** - jam.dev, screenshots, videos
- ✅ **Evidence types** - flexible (any URL)
- ✅ **Description** - optional notes per evidence
- ✅ **Delete evidence** - remove when not needed

---

## 🚧 Fitur yang Masih Ingin Ditambahkan

Berdasarkan planning di `FEATURE-PLANNING.md`, ada beberapa fitur yang masih dalam wishlist untuk development selanjutnya:

### 1. **Test Cycles / Versioning**

**Purpose:** Track tests across sprints/releases

**Use case:**

- Sprint 1: Test A failed
- Sprint 2: Test A passed (after fix)
- Sprint 3: Test A regression (failed again)

**Features:**

- Create cycles (Sprint 1, Sprint 2, Release 1.0)
- Assign tests to cycles
- View test history across cycles
- Compare results between cycles

**Status:** 📋 Planned (3-4 days implementation)

### 2. **Test Case Library dengan Tag-Based Reference**

**Purpose:** Separate test tracking dari test case template, dengan tagging sebagai bridge

**Konsep:**

Saat ini, sistem ini fokus ke **test tracking** (bug tracker / test tracker). Kedepannya, akan ada **test case library** yang bisa di-refer dari test tracking berdasarkan **tags**.

**Use case:**

- Test Case: "Login with valid credentials" (tagged: `authentication`, `positive-case`)
- Test Tracking Sprint 1: Refer ke test case tersebut → Result: PASSED
- Test Tracking Sprint 2: Reuse test case yang sama → Result: FAILED (regression)
- Test Tracking Sprint 3: Reuse lagi → Result: PASSED (fixed)

**Features:**

- **Test Case Library** - repository of reusable test cases
- **Tag-based reference** - test tracking bisa refer ke test case by tags
- **Reusability** - test case bisa dipakai di multiple cycles/versions
- **Version tracking** - track hasil test case across different cycles
- **Template system** - test case jadi template untuk test tracking

**Why this matters:**

Ini align dengan best practice QA dimana **test case** (what to test) terpisah dari **test execution** (hasil testing). Test tracking yang sekarang sebenernya lebih ke test execution, jadi butuh layer test case library untuk lebih proper.

**Status:** � Future Enhancement (needs architecture refactor)

### 3. **Export/Import**

**Purpose:** Sync dengan Obsidian vault

**Export:**

- Generate `QA-2026-Tracking.md` dengan Active & Backlog tables
- Create detail files di `test-details/` folder
- Match exact format dari markdown files yang ada
- Download as ZIP

**Import:**

- Parse existing markdown files
- Import ke database
- Conflict resolution (replace, merge, skip)

**Status:** 📋 Planned (2-3 days implementation)

### 4. **Bulk Operations**

**Purpose:** Efficiency untuk banyak tests

**Features:**

- Bulk delete
- Bulk status update
- Bulk tag assignment
- Bulk export

**Status:** 📋 Planned (1-2 days implementation)

### 5. **Advanced Filtering**

**Purpose:** Find tests lebih cepat

**Features:**

- Filter by tags (multi-select)
- Filter by date range
- Combine filters (AND/OR logic)
- Save filter presets

**Status:** 📋 Planned (1 day implementation)

---

## 📊 Current Implementation Status

### ✅ Completed (100%)

1. ✅ Project setup & database schema
2. ✅ Backend API (14 endpoints)
3. ✅ Frontend core features
4. ✅ Dashboard & statistics
5. ✅ Test CRUD operations
6. ✅ Evidence management
7. ✅ Test details with markdown
8. ✅ Tagging system
9. ✅ Tag management page
10. ✅ Kanban board view
11. ✅ Toast UI Editor integration
12. ✅ Header-based navigation
13. ✅ Copy to clipboard (Markdown + Discord)
14. ✅ Search & filter
15. ✅ Data import from existing markdown (18 tests imported)

### 📋 Planned for Next Iteration

- Test Cycles/Versioning
- Export to Obsidian
- Import from Obsidian
- Bulk operations
- Advanced filtering

---

## 🎓 Learning Outcomes

### Technical Skills

1. **Full-stack development** - Backend (Express) + Frontend (Vue)
2. **Database design** - Prisma ORM + SQLite
3. **TypeScript** - Type-safe development
4. **REST API design** - RESTful endpoints
5. **State management** - Pinia stores
6. **Markdown processing** - Toast UI Editor
7. **UI/UX design** - TailwindCSS + responsive design

### QA Skills

1. **Test case management** - structure & organization
2. **Test tracking** - status, evidence, details
3. **Workflow optimization** - dari manual ke automated
4. **Tool evaluation** - pain points & solutions
5. **Documentation** - markdown, specs, planning

### Soft Skills

1. **Problem solving** - identify pain points & create solutions
2. **Self-learning** - learn new tech stack independently
3. **Project planning** - from concept to implementation
4. **Time management** - prioritize features
5. **Documentation** - clear specs & guides

---

## � Refleksi & Motivasi

### Mengapa Membuat Sistem Ini?

Sebenernya, sebagai QA Engineer, tidak harus buat tools sendiri, even lebih ke ide yang sangat tidak bisa dicontoh dari asumsi ku pribadi. Tapi ada beberapa alasan kenapa project ini tetap dilakukan:

**1. Evaluasi Diri sebagai QA Engineer**

Project ini jadi kesempatan buat aku untuk mengevaluasi ulang: seperti apa yang seharusnya dilakukan sebagai QA Engineer yang baik? Bagaimana cara organize test cases? Bagaimana cara track progress? Bagaimana cara dokumentasi yang proper? Dengan membuat tools sendiri, jadi lebih paham end-to-end workflow QA.

**2. IT Enthusiast yang Ingin Mendalami Development**

Minat pribadi aku bukan hanya di QA, tapi di seluruh aspek IT development—tidak cuma full-stack, tapi juga database design, API architecture, UI/UX, dan lain-lain. Project ini jadi wadah buat aku untuk explore berbagai teknologi dan best practices.

**3. Persiapan untuk Dokumentasi & Reporting yang Lebih Baik**

Jikalau kedepannya ada yang menginginkan dokumentasi test track atau test case yang lebih proper, sistem ini sudah siap digunakan. Reporting jadi lebih tanggap, data lebih terorganisir, dan bisa langsung di-export ke format yang dibutuhkan (Obsidian, Discord, atau format lain).

**4. Memanfaatkan Fasilitas yang Diberikan**

Selama development, tools dan fasilitas dari MyMedica sangat membantu—terutama Kiro AI yang bisa assist dalam coding dan problem solving. Ini jadi kesempatan buat aku untuk maximize learning dengan resources yang ada.

### Pertimbangan & Awareness

Aku paham bahwa ini adalah personal initiative dan mungkin ada banyak pertimbangan dari tim atau dari Mas Irwan. Aku sudah memikirkan hal ini dengan baik:

- **Tidak mengganggu pekerjaan utama** - development dilakukan di luar jam kerja
- **Bukan replacement untuk tools existing** - yakni sebuah complement, bukan competitor
- **Open untuk feedback** - kalau ada saran atau kritik, aku sangat amat welcome
- **Learning-focused** - prioritas utama adalah belajar, bukan production-ready tool

---

## 📈 Impact & Benefits

### Untuk Diri Sendiri

1. ✅ **Workflow lebih efisien** - tidak perlu manual edit markdown lagi
2. ✅ **Organisasi lebih baik** - tags, filters, search yang proper
3. ✅ **Visual tracking** - kanban board dan statistics real-time
4. ✅ **Dokumentasi lebih mudah** - copy untuk Discord, export ke Obsidian
5. ✅ **Skill development** - hands-on experience dengan full-stack technologies
6. ✅ **Portfolio piece** - demonstrable project untuk career growth

### Potensi untuk Tim (Jika Dibutuhkan)

1. 💡 **Centralized tracking** - semua test di satu tempat, mudah diakses
2. 💡 **Easy onboarding** - UI simple, workflow jelas
3. 💡 **Flexible export** - bisa ke berbagai format sesuai kebutuhan
4. 💡 **No licensing cost** - free & open source
5. 💡 **Customizable** - bisa tambah fitur sesuai kebutuhan tim
6. 💡 **Lightweight** - tidak perlu infrastructure kompleks

---

## 🚀 How to Run

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repo-url>
cd qa-management-tool

# Install dependencies
npm install

# Run both backend & frontend
npm run dev
```

### Access

- **Frontend:** <http://localhost:5173>
- **Backend API:** <http://localhost:3000>
- **Database:** `backend/prisma/dev.db` (SQLite)

---

## 📁 Project Structure

```
qa-management-tool/
├── backend/                    # Express API
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── dev.db             # SQLite database
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   └── types/             # TypeScript types
│   └── scripts/               # Utility scripts
├── frontend/                   # Vue.js app
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── views/             # Page views
│   │   ├── stores/            # Pinia stores
│   │   ├── services/          # API services
│   │   └── utils/             # Helper functions
│   └── public/                # Static assets
└── .kiro/                     # Documentation
    ├── specs/                 # Feature specs
    └── docs/                  # Guides
```

---

## 🎯 Success Metrics

### Quantitative

- ✅ **18 tests imported** from markdown files
- ✅ **14 API endpoints** implemented
- ✅ **12 default tags** seeded
- ✅ **4 view modes** (Dashboard, Table, Kanban, Detail)
- ✅ **2 copy formats** (Markdown, Discord)
- ✅ **100% feature completion** for POC phase

### Qualitative

- ✅ **Workflow improvement** - dari manual markdown ke web app yang lebih cepat
- ✅ **Better organization** - tags, filters, search yang proper
- ✅ **Easier documentation** - copy buttons, export ready untuk reporting
- ✅ **Learning achieved** - full-stack skills dan QA workflow understanding meningkat
- ✅ **Problem solved** - pain points yang dialami sudah teratasi

---

## 📝 Conclusion

QA Management Tool ini merupakan **personal project** yang lahir dari pain points nyata selama internship. Tujuan utamanya bukan untuk replace existing tools, tapi untuk:

1. **Mengevaluasi diri sebagai QA Engineer** - memahami workflow yang proper
2. **Menyalurkan minat di IT development** - hands-on dengan berbagai teknologi
3. **Mempersiapkan dokumentasi yang lebih baik** - sistem yang siap untuk reporting
4. **Memanfaatkan learning opportunity** - dengan tools dan fasilitas yang ada

**Key takeaway:**

> "Sebagai IT enthusiast, membuat tools sendiri bukan hanya soal solve problem, tapi juga soal understand the problem deeply. Dan dalam prosesnya, aku belajar jauh lebih banyak daripada sekedar pakai tools yang sudah jadi."

Tool ini masih dalam tahap **POC** dan akan terus dikembangkan sesuai kebutuhan. Terima kasih untuk semua support dan fasilitas yang diberikan selama internship, terutama akses ke Kiro yang sangat membantu dalam development process! 🙏

---

**Last Updated:** February 3, 2026  
**Version:** -  
**Status:**  POC Complete, while also being ongoing

