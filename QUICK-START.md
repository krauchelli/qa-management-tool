# Quick Start Guide

## 🚀 First Time Setup (5 minutes)

### Step 1: Start Dev Server
```bash
cd qa-management-tool
npm run dev
```

Open: http://localhost:5173

### Step 2: Select Folder
1. Click **"Select Folder (2026)"**
2. Navigate to: `~/obsidian-note/concept/Personal Internship Tracking/MyMedica/2026/`
3. Select the **2026** folder (not the file!)
4. Click "Select Folder"

✅ App loads automatically!

---

## 📊 Daily Usage

### View Dashboard
- See statistics
- Total tests, pass rate, fail rate
- Recent activity

### View Tests Table
- Click **"Tests"** tab
- See all tests with Bug IDs
- Search by feature/jira/notes
- Filter by status

### Edit Test
1. Click **"Edit"** button
2. Modify fields
3. Click **"Save Changes"** in modal
4. Click **"💾 Save Changes"** in header to write to file

### View Detail File
1. Click **"📄 Detail"** button (only on tests with detail files)
2. Modal opens with full content
3. See markdown from `test-details/` folder

### Save Changes
1. Make edits
2. Click **"💾 Save Changes"** in header
3. Changes written to `QA-2026-Tracking.md`
4. Verify in Obsidian

### Refresh from Obsidian
1. Edit file in Obsidian
2. Click **"🔄 Refresh"** in app
3. Changes appear in app

---

## 🆔 Bug ID System

Each test now has unique Bug ID:
- **BUG-01** through **BUG-11**: Active Tests
- **BUG-12** through **BUG-18**: Completed Tests

Benefits:
- No duplicate key warnings
- Easy reference
- Unique identifier
- Better tracking

---

## 🔧 Troubleshooting

### "File System Access API not supported"
**Solution:** Use Chrome, Edge, or Opera

### "Could not find QA-2026-Tracking.md"
**Solution:** Make sure you selected the `2026` folder, not a parent folder

### "No detail file linked"
**Solution:** Test doesn't have detail file. Only tests with `[[test-details/...]]` in Notes column have detail files.

### Changes not saving
**Solution:** 
1. Check if file is open in Obsidian (might be locked)
2. Close file in Obsidian
3. Try saving again

### Need to relocate folder
**Solution:** 
- Folder handle persists in browser
- Only need to relocate if you clear browser data
- Or click "Change Folder" to select different folder

---

## 📁 File Structure

```
2026/
├── QA-2026-Tracking.md          ← Main tracking file
├── test-details/
│   ├── ongoing-february-2026.md  ← Detail files
│   ├── ongoing-january-2026.md
│   └── ongoing-issues-2025.md
└── monthly/
    └── (archived tests)
```

---

## ⌨️ Quick Actions

| Action | Button | Location |
|--------|--------|----------|
| View Dashboard | Dashboard | Header |
| View Tests | Tests | Header |
| Save Changes | 💾 Save Changes | Header |
| Refresh | 🔄 Refresh | Header |
| Change Folder | Change Folder | Header |
| Edit Test | Edit | Table row |
| View Detail | 📄 Detail | Table row |
| View Evidence | 🔗 Evidence | Table row |

---

## 🎯 Common Workflows

### Add New Test (Manual)
1. Open `QA-2026-Tracking.md` in Obsidian
2. Add row to Active Tests table
3. Assign next Bug ID (e.g., BUG-19)
4. Click "🔄 Refresh" in app

### Update Test Status
1. Click "Edit" on test
2. Change status dropdown
3. Click "Save Changes" in modal
4. Click "💾 Save Changes" in header

### Move Test to Backlog
1. Click "Edit" on test
2. Change status to "✅ Passed"
3. Save
4. Test moves to Completed Tests Backlog

### View Test Details
1. Find test with detail file
2. Click "📄 Detail"
3. Read full content
4. Close modal

---

## 💡 Tips

1. **Keep folder selected:** Folder handle persists, no need to relocate
2. **Save often:** Click "💾 Save Changes" after edits
3. **Refresh when needed:** Click "🔄 Refresh" to sync with Obsidian
4. **Use Bug IDs:** Reference tests by Bug ID (e.g., "Check BUG-01")
5. **Search is powerful:** Search works across feature, jira, and notes

---

## 🎉 You're Ready!

The app is fully functional. Start managing your QA tests!

For detailed documentation, see:
- `SETUP.md` - Full setup guide
- `SERVICES.md` - Service documentation
- `ISSUES-FIXED.md` - Recent fixes

---

*Last updated: 2026-02-02*
