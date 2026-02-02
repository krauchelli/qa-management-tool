# Data Import from Markdown Files

Script untuk import data test dari markdown files yang ada di folder `concept/Personal Internship Tracking/MyMedica/`.

## Data Sources

Data diambil dari:
1. **QA-2026-Tracking.md** - Active tests dan completed tests dari 2026
2. **test-details/ongoing-february-2026.md** - Detail tests February 2026
3. **test-details/ongoing-january-2026.md** - Detail tests January 2026
4. **test-details/ongoing-issues-2025.md** - Open issues dari 2025

## Data yang Diimport

Total **20 test records** dengan breakdown:

### Active Tests (In Progress/Failed)
- 🟡 **2 In Progress** (February 2026)
  - HRIS - Pengajuan Cuti (Internal Server Error & Date Mismatch)
  - Cetak Detail Resep (Data Pasien Mismatch)
  - Manajemen Personil (Tambah Personil Issues)

- 🔴 **8 Failed** (December 2025 - July 2025)
  - General UI: Confirmation Modal Error, Toast Double
  - HRIS: Login Redirect, Presensi Error
  - Farmasi: SOAP Apoteker Alergi, Dropdown Issue
  - Front Office: Data Alamat Kosong
  - Portal: UI Fixes

### Completed Tests (Passed)
- ✅ **8 Passed** (January-February 2026)
  - HRIS: Pengajuan Cuti, Jam Keluar, Presensi, Cuti, Tukar Shift
  - Pembayaran: Konsultasi, Void

## Import Features

Script akan import:
- ✅ Test basic information (date, feature, jira, status, env, notes)
- ✅ Evidence URLs (jam.dev links)
- ✅ Detailed test notes (markdown content)

## How to Run

### 1. Make sure backend server is NOT running
```bash
# Stop backend if running
# Ctrl+C on the terminal running backend
```

### 2. Run import script
```bash
cd qa-management-tool/backend
npm run import
```

### 3. Check results
Script akan menampilkan:
- ✅ Imported: jumlah test yang berhasil diimport
- ⏭️  Skipped: jumlah test yang sudah ada (duplicate)
- ❌ Errors: jumlah error yang terjadi

### 4. Verify in app
```bash
# Start backend
npm run dev

# In another terminal, start frontend
cd ../frontend
npm run dev
```

Buka http://localhost:5173 dan check:
- Dashboard: statistics should show imported data
- Tests page: all imported tests should appear
- Test details: evidence and detailed notes should be visible

## Data Mapping

### Status Mapping
- ✅ → `PASSED`
- 🔴 → `FAILED`
- 🟡 → `IN_PROGRESS`
- ❌ → `BLOCKED`

### Environment Mapping
- `dev` → `DEV`
- `staging` → `STAGING`
- `prod`/`production` → `PROD`

### Evidence
- Semua jam.dev links akan diextract dan disimpan sebagai evidence
- Type: `jam.dev`
- Description: `Imported from markdown`

### Details
- Title: Short summary dari issue
- Content: Full markdown content dengan:
  - Issue summary
  - Steps to reproduce
  - Expected vs Actual results
  - Test evidence links
  - Next steps

## Example Output

```
🚀 Starting import from markdown files...

📝 Importing: HRIS - Pengajuan Cuti (2026-02-02)
  ✅ Added 1 evidence(s)
  ✅ Added test details
  ✅ Imported successfully

📝 Importing: Cetak Detail Resep (2026-01-30)
  ✅ Added 1 evidence(s)
  ✅ Added test details
  ✅ Imported successfully

...

📊 Import Summary:
  ✅ Imported: 20
  ⏭️  Skipped: 0
  ❌ Errors: 0
  📝 Total: 20
```

## Troubleshooting

### Error: "Cannot find module '@prisma/client'"
```bash
cd backend
npm install
npx prisma generate
```

### Error: "Database not found"
```bash
cd backend
npx prisma migrate dev
```

### Duplicate entries
Script akan skip test yang sudah ada (based on unique constraint).
Jika ingin re-import, hapus database dulu:
```bash
cd backend
rm prisma/dev.db
npx prisma migrate dev
npm run import
```

## Notes

- Script bersifat **idempotent** - aman untuk dijalankan multiple times
- Duplicate tests akan di-skip automatically
- Evidence dan details akan di-link ke test yang sesuai
- Jira URLs akan di-generate otomatis jika hanya ticket number yang ada

## Next Steps

Setelah import berhasil:
1. ✅ Review imported data di web app
2. ✅ Update status tests yang sudah fixed
3. ✅ Add more evidence jika ada
4. ✅ Continue testing dan update via web interface
