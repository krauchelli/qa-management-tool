import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface TestData {
  date: string;
  feature: string;
  jira: string | null;
  jiraUrl: string | null;
  status: 'PASSED' | 'FAILED' | 'IN_PROGRESS' | 'BLOCKED';
  env: 'DEV' | 'STAGING' | 'PROD';
  notes: string | null;
  evidenceUrls: string[];
  detailTitle?: string;
  detailContent?: string;
}

// Parse status emoji to enum
function parseStatus(emoji: string): 'PASSED' | 'FAILED' | 'IN_PROGRESS' | 'BLOCKED' {
  switch (emoji) {
    case '✅':
      return 'PASSED';
    case '🔴':
      return 'FAILED';
    case '🟡':
      return 'IN_PROGRESS';
    case '❌':
      return 'BLOCKED';
    default:
      return 'IN_PROGRESS';
  }
}

// Parse environment
function parseEnv(env: string): 'DEV' | 'STAGING' | 'PROD' {
  const normalized = env.toLowerCase().trim();
  if (normalized === 'dev') return 'DEV';
  if (normalized === 'staging') return 'STAGING';
  if (normalized === 'prod' || normalized === 'production') return 'PROD';
  return 'DEV';
}

// Extract Jira ticket from text
function extractJira(text: string): { jira: string | null; jiraUrl: string | null } {
  const jiraMatch = text.match(/\[#(MD-\d+)\]\((https:\/\/[^\)]+)\)/);
  if (jiraMatch) {
    return {
      jira: `#${jiraMatch[1]}`,
      jiraUrl: jiraMatch[2]
    };
  }
  
  const simpleMatch = text.match(/#(MD-\d+)/);
  if (simpleMatch) {
    return {
      jira: `#${simpleMatch[1]}`,
      jiraUrl: `https://mymedicaid.atlassian.net/browse/${simpleMatch[1]}`
    };
  }
  
  return { jira: null, jiraUrl: null };
}

// Extract evidence URLs
function extractEvidence(text: string): string[] {
  const urls: string[] = [];
  const jamDevMatches = text.matchAll(/\[jam\.dev\]\((https:\/\/jam\.dev\/[^\)]+)\)/g);
  for (const match of jamDevMatches) {
    urls.push(match[1]);
  }
  
  const directMatches = text.matchAll(/(https:\/\/jam\.dev\/[^\s\)]+)/g);
  for (const match of directMatches) {
    if (!urls.includes(match[1])) {
      urls.push(match[1]);
    }
  }
  
  return urls;
}

// Parse date to YYYY-MM-DD format
function parseDate(dateStr: string): string {
  // Handle formats like "2026-02-02", "2026-01-30", "2025-12-XX"
  if (dateStr.includes('XX')) {
    return dateStr.replace('XX', '01');
  }
  
  // If already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Default to today if can't parse
  return new Date().toISOString().split('T')[0];
}

const testsToImport: TestData[] = [
  // February 2026 - Active Tests
  {
    date: '2026-02-02',
    feature: 'HRIS - Pengajuan Cuti',
    jira: '#MD-1871',
    jiraUrl: 'https://mymedicaid.atlassian.net/browse/MD-1871',
    status: 'IN_PROGRESS',
    env: 'PROD',
    notes: 'Date Mismatch - Internal Server Error saat tolak dari dropdown',
    evidenceUrls: ['https://jam.dev/c/767324af-d1bb-4426-83b8-9e20965167a0'],
    detailTitle: 'Internal Server Error & Date Mismatch',
    detailContent: `## Issue #1: Internal Server Error

**Severity:** High

### Issue Summary
Internal Server Error terjadi saat menolak pengajuan cuti dari dropdown di halaman list, tetapi berhasil setelah membuka detail terlebih dahulu.

### Steps to Reproduce
1. Login sebagai admin/approver
2. Buka halaman **Pengajuan Cuti** (list view)
3. Klik dropdown action pada salah satu pengajuan
4. Pilih **"Tolak"** langsung dari dropdown

### Expected Result
- Pengajuan berhasil ditolak
- Status berubah menjadi "Ditolak"
- Tidak ada error

### Actual Result
- **Internal Server Error** muncul
- Pengajuan tidak ditolak
- User harus buka detail dulu baru bisa tolak

### Test Evidence
- Validasi #1: Tolak dari Detail → ✅ Berhasil
- Validasi #2: Buka Detail Dulu → ✅ Berhasil
- Validasi #3: Langsung dari Dropdown → ❌ Error

## Issue #2: Date Mismatch

**Severity:** Minor

### Issue Summary
Tanggal pengajuan cuti yang ditampilkan berbeda antara HRIS mobile dan Web Admin.

**Example:**
- HRIS Mobile: \`2 Februari - 2 Februari\`
- Web Admin: \`2 Februari - 3 Februari\`

Tanggal akhir di Web Admin lebih 1 hari dari yang seharusnya.`
  },
  
  // January 2026 - Active Tests
  {
    date: '2026-01-30',
    feature: 'Cetak Detail Resep',
    jira: null,
    jiraUrl: null,
    status: 'IN_PROGRESS',
    env: 'STAGING',
    notes: 'Data Pasien Mismatch - nomor telepon dan tinggi badan salah',
    evidenceUrls: ['https://jam.dev/c/216b5a57-4c2c-4b38-84c6-3956915aaa67'],
    detailTitle: 'Data Pasien Mismatch',
    detailContent: `## Issue: Data Pasien Mismatch

**Status:** 🟡 In Progress  
**Environment:** Staging

### Issue Summary
Regression test pada \`Cetak Detail Resep\`, ada data pasien mismatch:
- Nomor telepon pasien salah
- Berat/tinggi pasien (tinggi badan salah)

### Next Steps
- [ ] Report to dev team
- [ ] Create Jira ticket
- [ ] Retest after fix`
  },
  
  {
    date: '2026-01-29',
    feature: 'Manajemen Personil',
    jira: null,
    jiraUrl: null,
    status: 'IN_PROGRESS',
    env: 'STAGING',
    notes: 'Tambah Personil Issues - double alert, data tidak tersimpan',
    evidenceUrls: [],
    detailTitle: 'Tambah Personil Issues',
    detailContent: `## Issue: Tambah Personil

**Status:** 🟡 In Progress  
**Environment:** Staging

### Positive Tests (✅ Passed)
- Admin role
- Kasir role
- Front Office role

### Issues Found
- ❌ Double success alert/notification
- ❌ Data pengisian \`Jadwal Pembayaran\` tidak tersimpan
- ❌ Dibutuhkan error handler atau alert dari sisi FE

### Next Steps
- [ ] Report UI issues (double alert)
- [ ] Report data persistence issue (Jadwal Pembayaran)
- [ ] Request FE error handler improvement
- [ ] Retest after fixes`
  },
  
  // December 2025 - Open Issues
  {
    date: '2025-12-01',
    feature: 'General UI',
    jira: '#MD-1714',
    jiraUrl: 'https://mymedicaid.atlassian.net/browse/MD-1714',
    status: 'FAILED',
    env: 'DEV',
    notes: 'Confirmation Modal Error',
    evidenceUrls: [],
    detailTitle: 'Confirmation Modal Error',
    detailContent: `## Issue: Confirmation Modal Error

**Status:** 🔴 Open  
**Feature:** General UI  
**First Found:** 2025-12

### Description
Modal konfirmasi menampilkan error atau tidak muncul dengan benar

### Next Steps
- [ ] Retest in 2026
- [ ] Get detailed reproduction steps
- [ ] Verify fix`
  },
  
  {
    date: '2025-12-01',
    feature: 'General UI',
    jira: '#MD-1720',
    jiraUrl: 'https://mymedicaid.atlassian.net/browse/MD-1720',
    status: 'FAILED',
    env: 'DEV',
    notes: 'Toast Double - notification muncul dua kali',
    evidenceUrls: [],
    detailTitle: 'Toast Double',
    detailContent: `## Issue: Toast Double

**Status:** 🔴 Open  
**Feature:** General UI  
**First Found:** 2025-12

### Description
Toast notification muncul dua kali untuk satu action

### Next Steps
- [ ] Retest in 2026
- [ ] Identify root cause
- [ ] Verify fix doesn't break other notifications`
  },
  
  {
    date: '2025-12-01',
    feature: 'HRIS',
    jira: '#MD-1817',
    jiraUrl: 'https://mymedicaid.atlassian.net/browse/MD-1817',
    status: 'FAILED',
    env: 'DEV',
    notes: 'Login Redirect Issue - redirect tidak berfungsi setelah login',
    evidenceUrls: [],
    detailTitle: 'Login Redirect Issue',
    detailContent: `## Issue: HRIS Login Redirect

**Status:** 🔴 Open  
**Feature:** HRIS  
**First Found:** 2025-12

### Description
Setelah login HRIS, redirect tidak berfungsi dengan benar

### Next Steps
- [ ] Retest in 2026
- [ ] Check routing configuration
- [ ] Verify authentication flow`
  },
  
  {
    date: '2025-12-01',
    feature: 'HRIS',
    jira: '#MD-1798',
    jiraUrl: 'https://mymedicaid.atlassian.net/browse/MD-1798',
    status: 'FAILED',
    env: 'DEV',
    notes: 'Presensi Error',
    evidenceUrls: [],
    detailTitle: 'Presensi Error',
    detailContent: `## Issue: HRIS Presensi Error

**Status:** 🔴 Open  
**Feature:** HRIS  
**First Found:** 2025-12

### Description
Error saat melakukan presensi di HRIS

### Next Steps
- [ ] Retest in 2026
- [ ] Get error logs
- [ ] Identify specific error scenario`
  },
  
  {
    date: '2025-12-01',
    feature: 'Portal',
    jira: '#MD-1825',
    jiraUrl: 'https://mymedicaid.atlassian.net/browse/MD-1825',
    status: 'IN_PROGRESS',
    env: 'DEV',
    notes: 'UI Fixes - various UI improvements',
    evidenceUrls: [],
    detailTitle: 'Portal UI Fixes',
    detailContent: `## Issue: Portal UI Fixes

**Status:** 🟡 In Progress  
**Feature:** Portal  
**First Found:** 2025-12

### Description
Various UI fixes untuk portal

### Next Steps
- [ ] Review UI fix list
- [ ] Test each fix individually
- [ ] Verify no regression`
  },
  
  // July 2025 - Farmasi Issues
  {
    date: '2025-07-12',
    feature: 'Farmasi - Penjualan Obat',
    jira: '#MD-844',
    jiraUrl: 'https://mymedicaid.atlassian.net/browse/MD-844',
    status: 'FAILED',
    env: 'DEV',
    notes: 'SOAP Apoteker - Alergi tidak sinkron',
    evidenceUrls: ['https://jam.dev/c/3f1f5e0d-1e50-418f-b3ce-f1d7303256f5'],
    detailTitle: 'SOAP Apoteker - Data Alergi Issue',
    detailContent: `## Issue: SOAP Apoteker - Data Alergi

**Status:** 🔴 Open  
**Jira:** MD-844  
**Environment:** Dev

### Description
- Data alergi tidak sinkron dengan riwayat alergi pasien
- Tidak bisa menambah atau mengubah data alergi di form SOAP Apoteker

### Evidence
https://jam.dev/c/3f1f5e0d-1e50-418f-b3ce-f1d7303256f5

### Next Steps
- [ ] Retest in 2026
- [ ] Verify data sync mechanism
- [ ] Test add/edit functionality`
  },
  
  {
    date: '2025-07-12',
    feature: 'Farmasi - Pelayanan Resep',
    jira: null,
    jiraUrl: null,
    status: 'FAILED',
    env: 'DEV',
    notes: 'Dropdown Issue - dropdown terkadang mental',
    evidenceUrls: [],
    detailTitle: 'Dropdown Issue',
    detailContent: `## Issue: Pelayanan Resep - Dropdown

**Status:** 🔴 Open  
**Environment:** Dev

### Description
Dropdown terkadang "mental" (tidak stabil)

### Next Steps
- [ ] Identify specific dropdown
- [ ] Get reproduction steps
- [ ] Test on different browsers`
  },
  
  {
    date: '2025-07-15',
    feature: 'Front Office',
    jira: null,
    jiraUrl: null,
    status: 'FAILED',
    env: 'DEV',
    notes: 'Data Alamat Kosong setelah input kedua kali',
    evidenceUrls: ['https://jam.dev/c/3755d3e9-1f69-45f1-805a-9e8a292fb047'],
    detailTitle: 'Data Alamat Kosong',
    detailContent: `## Issue: Tambah Pasien - Data Alamat Kosong

**Status:** 🔴 Open  
**Environment:** Dev

### Description
Case menambahkan pasien untuk kedua kalinya setelah diisi informasi alamat dan lokasi, isinya kosong

### Evidence
https://jam.dev/c/3755d3e9-1f69-45f1-805a-9e8a292fb047

### Next Steps
- [ ] Retest in 2026
- [ ] Check form state management
- [ ] Verify data persistence`
  },
  
  // Completed Tests
  {
    date: '2026-02-02',
    feature: 'HRIS - Pengajuan Cuti',
    jira: '#MD-1871',
    jiraUrl: 'https://mymedicaid.atlassian.net/browse/MD-1871',
    status: 'PASSED',
    env: 'PROD',
    notes: 'Fixed - Internal Server Error resolved',
    evidenceUrls: ['https://jam.dev/c/4132384b-b2b0-4bf2-9c8e-ba2f674daed6'],
    detailTitle: 'Internal Server Error - Fixed',
    detailContent: `## Test: Internal Server Error - Fixed

**Status:** ✅ Passed  
**Environment:** Production

### Test Summary
Retest setelah fix deployed. Internal Server Error sudah resolved.

### Test Evidence
https://jam.dev/c/4132384b-b2b0-4bf2-9c8e-ba2f674daed6

### Result
✅ All scenarios passed
✅ No more errors
✅ Tolak dari dropdown works correctly`
  },
  
  {
    date: '2026-01-23',
    feature: 'HRIS',
    jira: '#MD-1921',
    jiraUrl: 'https://mymedicaid.atlassian.net/browse/MD-1921',
    status: 'PASSED',
    env: 'STAGING',
    notes: 'Jam Keluar & Auto Refresh - Fixed',
    evidenceUrls: [],
    detailTitle: 'HRIS Jam Keluar & Auto Refresh',
    detailContent: `## Test: HRIS Jam Keluar & Auto Refresh

**Status:** ✅ Passed  
**Environment:** Staging

### Test Summary
HRIS - jam keluar dan auto refresh issue sudah fixed

### Result
✅ Jam keluar works correctly
✅ Auto refresh functioning properly`
  },
  
  {
    date: '2026-01-21',
    feature: 'HRIS - Presensi',
    jira: '#MD-1908',
    jiraUrl: 'https://mymedicaid.atlassian.net/browse/MD-1908',
    status: 'PASSED',
    env: 'STAGING',
    notes: 'After NextJS Upgrade - Presensi fixed',
    evidenceUrls: ['https://jam.dev/c/3f9dc8c3-cb2a-43ab-85a4-7b244f92f54d'],
    detailTitle: 'HRIS Presensi After NextJS Upgrade',
    detailContent: `## Test: HRIS Presensi After NextJS Upgrade

**Status:** ✅ Passed  
**Environment:** Staging

### Issues Fixed
- ✅ Waktu clock in dan clock out sudah sinkron
- ✅ Status auto refresh works

### Evidence
https://jam.dev/c/3f9dc8c3-cb2a-43ab-85a4-7b244f92f54d`
  },
  
  {
    date: '2026-01-21',
    feature: 'HRIS - Cuti',
    jira: '#MD-1908',
    jiraUrl: 'https://mymedicaid.atlassian.net/browse/MD-1908',
    status: 'PASSED',
    env: 'STAGING',
    notes: 'After NextJS Upgrade - Cuti calendar fixed',
    evidenceUrls: ['https://jam.dev/c/3cad2134-f222-4384-b9c8-5752ac336d01'],
    detailTitle: 'HRIS Cuti After NextJS Upgrade',
    detailContent: `## Test: HRIS Cuti After NextJS Upgrade

**Status:** ✅ Passed  
**Environment:** Staging

### Issues Fixed
- ✅ Pengajuan cuti tanggal sudah benar di kalender
- ✅ Shift tidak muncul saat cuti

### Evidence
https://jam.dev/c/3cad2134-f222-4384-b9c8-5752ac336d01`
  },
  
  {
    date: '2026-01-21',
    feature: 'HRIS - Tukar Shift',
    jira: '#MD-1908',
    jiraUrl: 'https://mymedicaid.atlassian.net/browse/MD-1908',
    status: 'PASSED',
    env: 'STAGING',
    notes: 'After NextJS Upgrade - Validation added',
    evidenceUrls: ['https://jam.dev/c/9ef00098-340d-4084-817a-6d8089b8760f'],
    detailTitle: 'HRIS Tukar Shift After NextJS Upgrade',
    detailContent: `## Test: HRIS Tukar Shift After NextJS Upgrade

**Status:** ✅ Passed  
**Environment:** Staging

### Issues Fixed
- ✅ Validation untuk prevent overlap dengan cuti
- ✅ Tidak bisa submit tukar shift ke tanggal cuti

### Evidence
https://jam.dev/c/9ef00098-340d-4084-817a-6d8089b8760f`
  },
  
  {
    date: '2026-01-29',
    feature: 'Pembayaran Konsultasi',
    jira: null,
    jiraUrl: null,
    status: 'PASSED',
    env: 'STAGING',
    notes: 'Consultation fee reset - Fixed',
    evidenceUrls: ['https://jam.dev/c/72312572-d7a1-43ff-822a-7f54914abe96'],
    detailTitle: 'Pembayaran Konsultasi - Fee Reset Fixed',
    detailContent: `## Test: Pembayaran Konsultasi

**Status:** ✅ Passed  
**Environment:** Staging

### Issue Fixed
Consultation fee tidak lagi reset ke 0 setelah tambah obat/tindakan

### Evidence
https://jam.dev/c/72312572-d7a1-43ff-822a-7f54914abe96`
  },
  
  {
    date: '2026-01-28',
    feature: 'Pembayaran Void',
    jira: '#MD-1900',
    jiraUrl: 'https://mymedicaid.atlassian.net/browse/MD-1900',
    status: 'PASSED',
    env: 'STAGING',
    notes: 'Void calculation - Fixed',
    evidenceUrls: ['https://jam.dev/c/73e0b80d-84ba-412a-89c9-f1747cd5f71d'],
    detailTitle: 'Pembayaran Void - Calculation Fixed',
    detailContent: `## Test: Pembayaran Void

**Status:** ✅ Passed  
**Environment:** Staging

### Issues Fixed
- ✅ Total calculation correct after void
- ✅ Tabel nominal shows correct value

### Evidence
https://jam.dev/c/73e0b80d-84ba-412a-89c9-f1747cd5f71d`
  }
];

async function importTests() {
  console.log('🚀 Starting import from markdown files...\n');
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const testData of testsToImport) {
    try {
      console.log(`📝 Importing: ${testData.feature} (${testData.date})`);
      
      // Create test
      const test = await prisma.test.create({
        data: {
          date: testData.date,
          feature: testData.feature,
          jira: testData.jira,
          jiraUrl: testData.jiraUrl,
          status: testData.status,
          env: testData.env,
          notes: testData.notes,
        },
      });
      
      // Add evidence
      if (testData.evidenceUrls.length > 0) {
        for (const url of testData.evidenceUrls) {
          await prisma.evidence.create({
            data: {
              testId: test.id,
              type: 'jam.dev',
              url: url,
              description: 'Imported from markdown',
            },
          });
        }
        console.log(`  ✅ Added ${testData.evidenceUrls.length} evidence(s)`);
      }
      
      // Add details
      if (testData.detailTitle && testData.detailContent) {
        await prisma.detail.create({
          data: {
            testId: test.id,
            title: testData.detailTitle,
            content: testData.detailContent,
          },
        });
        console.log(`  ✅ Added test details`);
      }
      
      imported++;
      console.log(`  ✅ Imported successfully\n`);
      
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`  ⏭️  Skipped (already exists)\n`);
        skipped++;
      } else {
        console.error(`  ❌ Error: ${error.message}\n`);
        errors++;
      }
    }
  }
  
  console.log('📊 Import Summary:');
  console.log(`  ✅ Imported: ${imported}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log(`  📝 Total: ${testsToImport.length}`);
}

// Run import
importTests()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
