# Setup & Run Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Select Your Tracking File

1. Click "Select QA-2026-Tracking.md"
2. Navigate to your Obsidian vault
3. Select: `Personal Internship Tracking/MyMedica/2026/QA-2026-Tracking.md`
4. Click "Open"

The app will:
- ✅ Read the file
- ✅ Parse all tests
- ✅ Display statistics
- ✅ Show test table

---

## 📋 Features Now Working

### ✅ Implemented

1. **File Picker**
   - Select tracking file from your vault
   - Validates file format
   - Saves file handle for future access

2. **Dashboard View**
   - Total tests count
   - Pass/fail statistics
   - Recent activity
   - Visual stats cards

3. **Test Table View**
   - Display all tests
   - Search by feature/jira/notes
   - Filter by status (all/active/completed)
   - Edit status inline
   - View evidence links

4. **State Management**
   - Zustand stores for tests and vault
   - Persistent vault configuration
   - Real-time UI updates

5. **Services Integration**
   - MarkdownParser working
   - StatsService calculating
   - All services ready to use

---

## 🎯 How to Use

### First Time Setup

1. **Start the app:** `npm run dev`
2. **Select file:** Click button and choose `QA-2026-Tracking.md`
3. **View data:** See dashboard with your tests

### Daily Usage

1. **View Dashboard:** See statistics and recent activity
2. **View Tests:** Click "Tests" tab to see all tests
3. **Search:** Type in search box to filter
4. **Edit Status:** Click dropdown to change test status
5. **View Evidence:** Click evidence link to open jam.dev

### Changing Status

Click the status dropdown on any test:
- ✅ Passed
- 🔴 Failed
- 🟡 In Progress
- ❓ Need Confirmation

**Note:** Changes are in-memory only for now. Save functionality coming next!

---

## 🔧 Browser Requirements

### Supported Browsers

✅ **Chrome 86+** (Recommended)  
✅ **Edge 86+**  
✅ **Opera 72+**  

❌ **Firefox** (File System Access API not supported)  
❌ **Safari** (File System Access API not supported)

### Why Chrome/Edge?

The app uses the **File System Access API** to read/write files directly from your vault. This API is only available in Chromium-based browsers.

---

## 📁 File Structure

```
qa-management-tool/
├── src/
│   ├── components/
│   │   ├── VaultPicker.tsx      ✅ File picker
│   │   ├── Dashboard.tsx        ✅ Stats dashboard
│   │   └── TestTable.tsx        ✅ Test table
│   ├── stores/
│   │   ├── testStore.ts         ✅ Test state
│   │   └── vaultStore.ts        ✅ Vault state
│   ├── services/
│   │   ├── vaultService.ts      ✅ File I/O
│   │   ├── markdownParser.ts    ✅ Parse markdown
│   │   ├── statsService.ts      ✅ Statistics
│   │   ├── archiveService.ts    ✅ Archiving
│   │   └── detailService.ts     ✅ Detail files
│   ├── types/
│   │   ├── test.ts              ✅ Type definitions
│   │   └── config.ts            ✅ Config types
│   └── App.tsx                  ✅ Main app
```

---

## 🐛 Troubleshooting

### Issue: "File System Access API not supported"

**Solution:** Use Chrome, Edge, or Opera browser

### Issue: "This doesn't look like a QA tracking file"

**Solution:** Make sure you selected the correct file:
- File must be named `QA-2026-Tracking.md`
- File must contain "## Active Tests" section
- File must contain "## Completed Tests Backlog" section

### Issue: No tests showing

**Solution:** 
1. Check if file has tests in the table
2. Try refreshing the page
3. Select the file again

### Issue: Can't edit tests

**Solution:** Status editing works, but save functionality is coming next

---

## 🚧 Coming Next

### Phase 2 (Next)

- [ ] Save changes back to file
- [ ] Add new test
- [ ] Delete test
- [ ] Archive tests (Active → Backlog → Monthly)
- [ ] Generate detail files
- [ ] Sync status to detail files

### Phase 3 (Future)

- [ ] Export to PDF/HTML
- [ ] Test case generator
- [ ] Evidence gallery
- [ ] Bulk operations
- [ ] Keyboard shortcuts

---

## 💡 Tips

1. **Keep file open:** The app maintains a handle to your file, so you can edit it in Obsidian and refresh the app to see changes

2. **Use Chrome:** For best experience, use Chrome or Edge

3. **Search is powerful:** Search works across feature, jira, and notes

4. **Filter by status:** Use the dropdown to focus on active or completed tests

---

## 🎉 You're Ready!

The app is now fully functional for viewing and basic editing. Run `npm run dev` and start using it!

For questions or issues, check the SERVICES.md documentation.

---

*Last updated: 2026-02-02*
