# 📋 QA Testing Checklist - MD1994 Multiple Clinic Fix

## 📌 Overview

**Ticket:** MD-1994  
**Title:** Fix Multiple Clinic & Session Storage Migration  
**Commits:**

- `55b02c29` - MD 1994 Fix bug migration from cookie to session storage multiple clinic
- `b5f4b0e3` - MD1994 Fix multiple clinic 2

**Summary:**  
Migration dari Cookies ke sessionStorage untuk data klinik, fix multiple clinic selection, dan third party integration (Kledo & Gajihub).

**Files Changed:**

- Authentication: `signin`, `complete-registration`, `select-clinic`
- Queue: `patient-data`, `patient-registration`, `initial-review`, `vital-signs`, `medical-record`
- Components: `header`, `sidebar/clinic-item`, `upload`
- Services: `clinic.service`, `accounting.service`
- Third Party: `kledo/page`, `gajihub/page`
- Hooks: `useLogout`

---

## 🎯 Testing Priority

- 🔴 **P0 (Critical):** Login, Select Clinic, Logout, Patient Registration
- 🟡 **P1 (High):** Initial Review, SOAP, Upload, Third Party Integration
- 🟢 **P2 (Medium):** Edge Cases, Browser Compatibility

**Estimated Testing Time:** 4-6 hours untuk full regression

---

## 🔐 1. AUTHENTICATION & CLINIC SELECTION

### 1.1 Login Flow - Single Clinic

- [✅] Login dengan user yang memiliki **1 klinik**
- [✅] Pastikan langsung redirect ke `/home`
- [✅] Pastikan `accessToken` tersimpan di Cookies
- [✅] Pastikan `currentClinic` tersimpan di sessionStorage (bukan Cookies)
- [✅] Pastikan data user tersimpan dengan benar

### 1.2 Login Flow - Multiple Clinic

- [✅] Login dengan user yang memiliki **lebih dari 1 klinik**
- [✅] Pastikan redirect ke `/select-clinic`
- [✅] Pastikan list klinik tampil dengan benar (nama, logo)
- [✅] Pastikan `allClinics` tersimpan di sessionStorage
- [✅] Klik salah satu klinik
- [✅] Pastikan redirect ke `/home`
- [✅] Pastikan `currentClinic` tersimpan di sessionStorage

### 1.3 Select Clinic Page

- [✅] Akses halaman `/select-clinic`
- [✅] Pastikan list klinik ter-load dari sessionStorage
- [✅] Pastikan gambar klinik tampil dengan benar
- [✅] Klik klinik → pastikan loading state muncul
- [✅] Pastikan data klinik yang dipilih tersimpan
- [✅] Pastikan Kledo token & endpoint ter-set (jika ada)
- [✅] Pastikan Gajihub token & endpoint ter-set (jika ada)
- [✅] Pastikan redirect ke `/home` berhasil

### 1.4 Complete Registration

- [✅] Akses halaman complete registration dengan registration key
- [✅] Isi username dan password
- [✅] Submit form
- [✅] **Multiple clinic:** Pastikan redirect ke `/select-clinic`
- [✅] **Single clinic:** Pastikan redirect ke `/home`
- [✅] Pastikan data tersimpan di sessionStorage dengan benar

### 1.5 Switch Clinic (Sidebar)

- [✅] Login dan masuk ke dashboard
- [✅] Buka sidebar → klik dropdown klinik
- [✅] Pastikan list klinik muncul
- [✅] Klik klinik lain
- [✅] Pastikan loading screen muncul
- [✅] Pastikan `currentClinic` di sessionStorage ter-update
- [✅] Pastikan Kledo & Gajihub token ter-update
- [✅] Pastikan page refresh dengan data klinik baru
- [✅] Pastikan tidak ada error di console

### 1.6 Logout

- [✅] Klik menu logout dari header
- [✅] Pastikan `sessionStorage.currentClinic` terhapus
- [✅] Pastikan `sessionStorage.allClinics` terhapus
- [✅] Pastikan semua Cookies terhapus
- [✅] Pastikan localStorage terhapus
- [✅] Pastikan redirect ke `/signin`
- [✅] Pastikan tidak bisa akses halaman authorized setelah logout

---

## 📝 2. QUEUE / ANTRIAN - PATIENT DATA

### 2.1 Akses Halaman Queue

- [✅] Login dan pilih klinik
- [✅] Akses menu Queue/Antrian
- [✅] Pastikan halaman queue terbuka
- [✅] Pastikan list pasien ter-load
- [✅] Pastikan data klinik dari sessionStorage ter-load dengan benar

### 2.2 Registrasi Pasien Baru - General

- [✅] Klik button "Tambah Pasien" / "Registrasi Pasien"
- [✅] Pastikan modal/halaman registrasi terbuka
- [✅] Pastikan form ter-load dengan benar
- [✅] Pastikan dropdown "Jenis Kunjungan" ter-populate
- [✅] Pastikan dropdown "Pembiayaan" ter-populate

### 2.3 Beauty Clinic - Jenis Kunjungan

- [✅] **Jenis Kunjungan: Perawatan**
  - [✅] Pilih "Perawatan"
  - [✅] Pastikan dropdown "Jenis Perawatan" muncul: Tubuh, Wajah
  - [✅] Pilih salah satu → pastikan tersimpan
- [✅] **Jenis Kunjungan: Kunjungan Sehat**
  - [✅] Pilih "Kunjungan Sehat"
  - [✅] Pastikan dropdown "Jenis Perawatan" muncul: Rawat Jalan
- [✅] **Jenis Kunjungan: Kunjungan Online**
  - [✅] Pilih "Kunjungan Online"
  - [✅] Pastikan dropdown "Jenis Perawatan" muncul: Tubuh, Wajah, Rawat Jalan

### 2.4 Puskesmas/Klinik - Jenis Kunjungan

- [✅] **Jenis Kunjungan: Kunjungan Sakit**
  - [✅] Pilih "Kunjungan Sakit"
  - [✅] Pastikan field Klaster & Siklus Hidup muncul
- [✅] **Jenis Kunjungan: Kunjungan Sehat**
  - [✅] Pilih "Kunjungan Sehat"
- [✅] **Jenis Kunjungan: Kunjungan Online**
  - [✅] Pilih "Kunjungan Online"
- [✅] **Jenis Kunjungan: UGD** (Puskesmas only)
  - [✅] Pilih "UGD"
- [✅] **Jenis Kunjungan: Laboratorium** (Puskesmas only)
  - [✅] Pilih "Laboratorium"

### 2.5 Pembiayaan - BPJS

- [✅] Pilih pembiayaan "BPJS"
- [✅] Pastikan field "NIK KTP" muncul dengan button "Cek Pasien"
- [✅] Pastikan field "Nomor BPJS" muncul dengan button "Cek Pasien"
- [✅] **Test NIK:**
  - [✅] Isi NIK 16 digit
  - [✅] Klik "Cek Pasien"
  - [✅] Pastikan loading muncul
  - [✅] Pastikan data dari SATUSEHAT ter-load (nama, IHS ID)
  - [✅] Pastikan tidak ada error
- [✅] **Test Nomor BPJS:**
  - [✅] Isi Nomor BPJS 13 digit
  - [✅] Pastikan otomatis dapat prefix "000" jika belum ada
  - [✅] Klik "Cek Pasien"
  - [✅] Pastikan data ter-load dengan benar
- [✅] **Test Auto-prefix 000:**
  - [✅] Isi nomor BPJS tanpa "000" di depan (misal: 1234567890123)
  - [✅] Pastikan sistem otomatis menambahkan "000" (jadi: 0001234567890123)

### 2.6 Pembiayaan - Pribadi

- [✅] Pilih pembiayaan "Pribadi"
- [✅] Pastikan field "Nomor Member" tidak muncul
- [✅] Pastikan field "Nomor BPJS" tidak hilang (preserved)
- [✅] Pastikan data tersimpan dengan benar

### 2.7 Pembiayaan - Asuransi Lain

- [✅] Pilih pembiayaan selain "BPJS" dan "Pribadi"
- [✅] Pastikan field "Nomor Member" muncul
- [✅] Isi nomor member
- [✅] Pastikan field "Nomor BPJS" tidak hilang (preserved)
- [✅] Pastikan data tersimpan dengan benar

### 2.8 Data Pasien - General

- [✅] Isi "Nama Pasien" (required)
- [✅] Pilih "Jenis Kelamin" (required)
- [✅] Isi "Tempat Lahir" dengan autocomplete (required)
- [✅] Pilih "Tanggal Lahir" (required)
- [✅] Pastikan umur ter-calculate otomatis
- [✅] Isi data alamat
- [✅] Isi nomor telepon
- [✅] Button "Atur Ulang" berfungsi

### 2.9 Submit Registrasi Pasien

- [✅] Isi semua field required
- [✅] Klik "Tambah ke Antrian"
- [✅] Pastikan dialog konfirmasi muncul
- [✅] Klik "Ya, Saya Yakin"
- [✅] Pastikan loading muncul
- [✅] Pastikan data tersimpan ke database
- [✅] Pastikan pasien muncul di list antrian
- [✅] Pastikan tidak ada error di console

---

## 🏥 3. INITIAL REVIEW (KAJIAN AWAL)

### 3.1 Akses Initial Review

- [✅] Dari halaman queue, pilih pasien
- [✅] Klik "Isi Kajian Awal" / "Initial Review"
- [✅] Pastikan modal/halaman initial review terbuka
- [✅] Pastikan data pasien ter-load dengan benar
- [✅] Pastikan data encounter ter-load
- [✅] Pastikan data klinik dari sessionStorage ter-load

### 3.2 Form Tenaga Medis (Non-Beauty Clinic)

- [✅] Pastikan section "Tenaga Medis" muncul
- [✅] **Dropdown Nama Dokter:**
  - [✅] Pastikan ter-populate dengan list dokter
  - [✅] Pilih dokter → pastikan tersimpan
  - [✅] Required field berfungsi
- [✅] **Dropdown Nama Perawat:**
  - [✅] Pastikan ter-populate dengan list perawat
  - [✅] Pastikan default value = current user (jika user adalah perawat)
  - [✅] Pilih perawat → pastikan tersimpan
  - [✅] Required field berfungsi

### 3.3 Klaster & Siklus Hidup (Puskesmas Only)

- [✅] Pastikan section "Klaster & Siklus Hidup" muncul
- [✅] Pastikan field "Klaster" readonly/disabled
- [✅] Pastikan field "Siklus Hidup" readonly/disabled
- [✅] Pastikan value ter-load dari data encounter

### 3.4 Penilaian Pasien (Non-Beauty Clinic)

- [✅] **Penandaan Pasien:**
  - [✅] Pastikan field penandaan pasien muncul
  - [✅] Pilih penandaan → pastikan tersimpan
- [✅] **Klasifikasi Triase:**
  - [✅] Dropdown: Hijau, Kuning, Merah, Hitam
  - [✅] Pilih salah satu → pastikan tersimpan
  - [✅] Required field berfungsi
- [✅] **Resiko Jatuh:**
  - [✅] Jika belum terisi: Button "Isi Penilaian" muncul
  - [✅] Klik button → modal screening terbuka
  - [✅] Isi form screening
  - [✅] Submit → pastikan badge muncul (Resiko Tinggi/Rendah/Tidak Beresiko)
  - [✅] Klik icon edit → modal terbuka kembali
- [✅] **Skala Nyeri:**
  - [✅] Checkbox "Tidak Ditanya" berfungsi
  - [✅] Slider 0-10 berfungsi
  - [✅] Value ter-update saat slider digeser
- [✅] **Status Merokok:**
  - [✅] Radio button "Merokok" / "Tidak Merokok"
  - [✅] Pilih salah satu → pastikan tersimpan

### 3.5 Pemeriksaan Pasien

- [✅] **Keluhan Utama:**
  - [✅] Textarea muncul
  - [✅] Isi keluhan (minimal 10 karakter untuk BPJS)
  - [✅] Pastikan validasi berfungsi
  - [✅] Required field berfungsi
- [✅] **Data Objektif / Visus (Poli Mata Only):**
  - [✅] Textarea muncul
  - [✅] Isi data visus
  - [✅] Pastikan tersimpan
- [✅] **Resep Kacamata (Poli Mata Only):**
  - [✅] Button "Tambah Resep Kacamata" muncul
  - [✅] Klik button → modal resep terbuka
  - [✅] Isi form resep
  - [✅] Submit → pastikan data tersimpan
  - [✅] Button berubah jadi "Ubah Resep Kacamata"

### 3.6 Tanda Vital & Pemeriksaan Fisik

- [✅] **Suhu Tubuh:** Input number, range 30-50°C
- [✅] **Sistole:** Input number, range 40-250 mmHg
- [✅] **Diastole:** Input number, range 30-180 mmHg
- [✅] **Nadi:** Input number, range 30-160 kali/menit
- [✅] **Frekuensi Pernafasan:** Input number, range 5-70 kali/menit
- [✅] **Saturasi Oksigen:** Input number, range 1-100%
- [✅] **Tinggi Badan:** Input number, range 1-210 cm
- [✅] **Berat Badan:** Input number, range 1-300 kg
- [✅] **Lingkar Kepala:** Input number
- [✅] **Lingkar Perut:** Input number, range 1-280 cm
- [✅] **IMT:** Auto-calculate saat isi tinggi & berat badan
- [✅] **Kategori IMT:** Muncul otomatis sesuai perhitungan

### 3.7 Submit Initial Review

- [✅] Isi semua field required
- [✅] Klik "Simpan" / "Submit"
- [✅] Pastikan validasi berfungsi
- [✅] Pastikan dialog konfirmasi muncul
- [✅] Klik "Ya, Saya Yakin"
- [✅] Pastikan loading muncul
- [✅] Pastikan data tersimpan ke database
- [✅] Pastikan status encounter berubah
- [✅] Pastikan tidak ada error di console
- [✅] Pastikan modal tertutup
- [✅] Pastikan list queue ter-refresh

---

## 💊 4. SOAP / MEDICAL RECORD

### 4.1 Akses Medical Record

- [✅] Dari halaman queue, pilih pasien yang sudah initial review
- [✅] Klik "Isi SOAP" / "Medical Record"
- [✅] Pastikan halaman SOAP terbuka
- [✅] Pastikan data encounter ter-load
- [✅] Pastikan data pasien ter-load
- [✅] Pastikan data klinik dari sessionStorage ter-load

### 4.2 Vital Signs - Beauty Clinic Layout

- [✅] **Pemeriksaan Fisik (Atas):**
  - [✅] Tabel pemeriksaan fisik ditampilkan di atas
  - [✅] Kolom: Pemeriksaan Fisik, Tanggal Sebelumnya (jika ada), Tanggal Sekarang
  - [✅] Field: Tinggi Badan, Berat Badan, Lingkar Kepala, Lingkar Perut, IMT
  - [✅] IMT auto-calculate
  - [✅] Kategori IMT muncul
- [✅] **Tanda-Tanda Vital (Collapsible):**
  - [✅] Section "Tanda-Tanda Vital" bisa di-collapse/expand
  - [✅] Klik header → expand/collapse berfungsi
  - [✅] Icon arrow berubah
  - [✅] Tabel tanda vital muncul saat expand
  - [✅] Field: Suhu, Sistole, Diastole, Nadi, Frekuensi Pernafasan, Saturasi

### 4.3 Vital Signs - Non-Beauty Clinic Layout

- [✅] **Tanda Vital (Single Table):**
  - [✅] Semua field dalam 1 tabel
  - [✅] Kolom: Tanda Vital, Tanggal Sebelumnya (jika ada), Tanggal Sekarang
  - [✅] Field tanda vital: Suhu, Sistole, Diastole, Nadi, Frekuensi Pernafasan, Saturasi
  - [✅] Field pemeriksaan fisik: Tinggi, Berat, Lingkar Kepala, Lingkar Perut, IMT
  - [✅] IMT auto-calculate
  - [✅] Kategori IMT muncul

### 4.4 Previous Objective Data

- [✅] **Jika ada data encounter sebelumnya:**
  - [✅] Kolom "Tanggal Sebelumnya" muncul
  - [✅] Tanggal ditampilkan dengan format yang benar
  - [✅] Data vital signs sebelumnya ditampilkan
  - [✅] Data pemeriksaan fisik sebelumnya ditampilkan
- [✅] **Jika tidak ada data sebelumnya:**
  - [✅] Hanya kolom "Tanggal Sekarang" yang muncul
  - [✅] Tidak ada error

### 4.5 Input Vital Signs

- [✅] Isi semua field vital signs
- [✅] Pastikan validasi range berfungsi:
  - [✅] Suhu Tubuh: 30-50°C
  - [✅] Sistole: 40-250 mmHg
  - [✅] Diastole: 30-180 mmHg
  - [✅] Nadi: 30-160 kali/menit
  - [✅] Frekuensi Pernafasan: 5-70 kali/menit
  - [✅] Saturasi Oksigen: 1-100%
  - [✅] Tinggi Badan: 1-210 cm
  - [✅] Berat Badan: 1-300 kg
  - [✅] Lingkar Perut: 1-280 cm
- [✅] Isi tinggi badan & berat badan
- [✅] Blur dari field → pastikan IMT ter-calculate
- [✅] Pastikan kategori IMT muncul (Underweight/Normal/Overweight/Obese)
- [✅] Pastikan data tersimpan saat blur

### 4.6 Subjective, Objective, Assessment, Plan

- [✅] **Subjective (Keluhan):**
  - [✅] Textarea muncul
  - [✅] Isi keluhan pasien
  - [✅] Pastikan tersimpan
- [✅] **Objective (Pemeriksaan Fisik):**
  - [✅] Textarea muncul
  - [✅] Isi hasil pemeriksaan fisik
  - [✅] Pastikan tersimpan
- [✅] **Assessment (Diagnosis):**
  - [✅] Textarea muncul
  - [✅] Isi diagnosis
  - [✅] Pastikan tersimpan
- [✅] **Plan (Rencana Tindakan):**
  - [✅] Textarea muncul
  - [✅] Isi rencana tindakan
  - [✅] Pastikan tersimpan

### 4.7 Submit SOAP

- [✅] Isi semua field required
- [✅] Klik "Simpan" / "Submit"
- [✅] Pastikan validasi berfungsi
- [✅] Pastikan dialog konfirmasi muncul
- [✅] Klik "Ya, Saya Yakin"
- [✅] Pastikan loading muncul
- [✅] Pastikan data tersimpan ke database
- [✅] Pastikan status encounter berubah
- [✅] Pastikan tidak ada error di console
- [✅] Pastikan redirect/refresh ke halaman queue

---

## 📤 5. UPLOAD / ARCHIVE

### 5.1 Akses Halaman Archive

- [ ] Login dan pilih klinik
- [ ] Akses menu "Arsip Klinik" / `/clinic/archive`
- [ ] Pastikan halaman archive terbuka
- [ ] Pastikan list archive ter-load
- [ ] Pastikan data klinik dari sessionStorage ter-load

### 5.2 Upload File Archive

- [ ] Klik button "Tambah Arsip"
- [ ] Pastikan modal upload terbuka
- [ ] Klik area upload atau drag & drop file
- [ ] Pilih file Excel (.xlsx, .xls)
- [ ] Pastikan file name muncul
- [ ] Pastikan progress bar muncul
- [ ] Klik "Upload" / "Simpan"
- [ ] Pastikan `clinic_id` dari sessionStorage ter-pass dengan benar
- [ ] Pastikan upload progress berfungsi
- [ ] Pastikan file tersimpan ke database
- [ ] Pastikan modal tertutup
- [ ] Pastikan list archive ter-refresh
- [ ] Pastikan file baru muncul di list

### 5.3 View Archive

- [ ] Klik button "View" pada salah satu archive
- [ ] Pastikan modal/halaman detail terbuka
- [ ] Pastikan data Excel ditampilkan dalam tabel
- [ ] Pastikan header tabel muncul
- [ ] Pastikan data rows muncul
- [ ] Pastikan tidak ada error

### 5.4 Delete Archive

- [ ] Klik button "Delete" pada salah satu archive
- [ ] Pastikan dialog konfirmasi muncul
- [ ] Klik "Ya, Saya Yakin"
- [ ] Pastikan loading muncul
- [ ] Pastikan archive terhapus dari database
- [ ] Pastikan list archive ter-refresh
- [ ] Pastikan archive tidak muncul lagi di list

### 5.5 Search & Pagination

- [ ] Test search functionality
- [ ] Test pagination (next, prev, page number)
- [ ] Pastikan data ter-filter dengan benar

---

## 🔗 6. THIRD PARTY INTEGRATION

### 6.1 Kledo Integration

- [ ] Login dan pilih klinik yang punya integrasi Kledo
- [ ] Pastikan Kledo token tersimpan di Cookies
- [ ] Pastikan Kledo endpoint tersimpan di localStorage
- [ ] Pastikan Kledo website_id tersimpan di localStorage
- [ ] Klik menu "Kledo" di sidebar
- [ ] Pastikan redirect ke `/third-party/kledo`
- [ ] Pastikan loading/redirect message muncul
- [ ] Pastikan token dari Cookies/sessionStorage ter-pass
- [ ] Pastikan endpoint ter-pass dengan benar
- [ ] Pastikan website_id ter-pass
- [ ] Pastikan redirect ke `https://app.kledo.com/?endpoint=...&token=...&website_id=...`
- [ ] Pastikan login otomatis di Kledo berhasil
- [ ] Pastikan dashboard Kledo terbuka

### 6.2 Gajihub Integration

- [ ] Login dan pilih klinik yang punya integrasi Gajihub
- [ ] Pastikan Gajihub token tersimpan di Cookies
- [ ] Pastikan Gajihub endpoint tersimpan di localStorage
- [ ] Pastikan Gajihub website_id tersimpan di localStorage
- [ ] Klik menu "Gajihub" di sidebar
- [ ] Pastikan redirect ke `/third-party/gajihub`
- [ ] Pastikan loading/redirect message muncul
- [ ] Pastikan token dari Cookies/sessionStorage ter-pass
- [ ] Pastikan endpoint ter-pass dengan benar
- [ ] Pastikan website_id ter-pass
- [ ] Pastikan redirect ke `https://app.gajihub.com/?endpoint=...&token=...&website_id=...`
- [ ] Pastikan login otomatis di Gajihub berhasil
- [ ] Pastikan dashboard Gajihub terbuka

### 6.3 Switch Clinic - Third Party Token Update

- [ ] Login dengan user multiple clinic
- [ ] Pilih klinik A (punya Kledo & Gajihub)
- [ ] Pastikan token Kledo & Gajihub ter-set
- [ ] Switch ke klinik B (punya Kledo & Gajihub berbeda)
- [ ] Pastikan token Kledo & Gajihub ter-update
- [ ] Test akses Kledo → pastikan login ke account klinik B
- [ ] Test akses Gajihub → pastikan login ke account klinik B

---

## 🔄 7. BACKWARD COMPATIBILITY

### 7.1 Migration dari Cookies ke SessionStorage

- [ ] **Setup:** User dengan data di Cookies (bukan sessionStorage)
- [ ] Login dengan user tersebut
- [ ] Pastikan data `currentClinic` ter-migrate dari Cookies ke sessionStorage
- [ ] Pastikan data `allClinics` ter-migrate dari Cookies ke sessionStorage
- [ ] Pastikan Cookies `currentClinic` & `allClinics` terhapus setelah migrasi
- [ ] Pastikan tidak ada data loss
- [ ] Pastikan aplikasi berfungsi normal
- [ ] Pastikan tidak ada error di console

### 7.2 Compatibility dengan Old Data Format

- [ ] Test dengan user yang punya data lama
- [ ] Pastikan data ter-load dengan benar
- [ ] Pastikan tidak ada breaking changes
- [ ] Pastikan tidak ada error

---

## 🌐 8. BROWSER COMPATIBILITY

### 8.1 Chrome (Latest)

- [ ] Test semua flow di Chrome
- [ ] Pastikan sessionStorage berfungsi
- [ ] Pastikan tidak ada error di console
- [ ] Pastikan UI/UX sesuai

### 8.2 Firefox (Latest)

- [ ] Test semua flow di Firefox
- [ ] Pastikan sessionStorage berfungsi
- [ ] Pastikan tidak ada error di console
- [ ] Pastikan UI/UX sesuai

### 8.3 Safari (Latest)

- [ ] Test semua flow di Safari
- [ ] Pastikan sessionStorage berfungsi
- [ ] Pastikan tidak ada error di console
- [ ] Pastikan UI/UX sesuai

### 8.4 Edge (Latest)

- [ ] Test semua flow di Edge
- [ ] Pastikan sessionStorage berfungsi
- [ ] Pastikan tidak ada error di console
- [ ] Pastikan UI/UX sesuai

### 8.5 Private/Incognito Mode

- [ ] Test login di private/incognito mode
- [ ] Pastikan sessionStorage berfungsi
- [ ] Pastikan tidak ada error
- [ ] Pastikan logout berfungsi

---

## ⚠️ 9. EDGE CASES

### 9.1 SessionStorage Disabled

- [ ] Disable sessionStorage di browser
- [ ] Test login
- [ ] Pastikan ada fallback atau error handling yang baik
- [ ] Pastikan aplikasi tidak crash

### 9.2 SessionStorage Full

- [ ] Fill sessionStorage sampai penuh
- [ ] Test login dan select clinic
- [ ] Pastikan ada error handling
- [ ] Pastikan user mendapat feedback yang jelas

### 9.3 Koneksi Internet Lambat

- [ ] Throttle koneksi internet (Chrome DevTools)
- [ ] Test login flow
- [ ] Test select clinic
- [ ] Test switch clinic
- [ ] Pastikan loading state muncul
- [ ] Pastikan tidak ada timeout error

### 9.4 Refresh Halaman

- [ ] Login dan pilih klinik
- [ ] Refresh halaman di berbagai route
- [ ] Pastikan data klinik tetap tersimpan
- [ ] Pastikan tidak perlu login ulang
- [ ] Pastikan tidak ada error

### 9.5 Multiple Tabs

- [ ] Buka aplikasi di 2 tabs
- [ ] Login di tab 1 dengan klinik A
- [ ] Login di tab 2 dengan klinik B
- [ ] Test behavior di kedua tabs
- [ ] Pastikan tidak ada conflict
- [ ] Pastikan data tidak tercampur

### 9.6 Session Timeout

- [ ] Login dan biarkan idle sampai session timeout
- [ ] Test akses halaman authorized
- [ ] Pastikan redirect ke login
- [ ] Pastikan error handling yang baik

### 9.7 API Error Handling

- [ ] Test dengan API yang return error
- [ ] Pastikan error message muncul
- [ ] Pastikan user mendapat feedback yang jelas
- [ ] Pastikan aplikasi tidak crash

### 9.8 Invalid Token

- [ ] Manipulasi token di Cookies/sessionStorage
- [ ] Test akses halaman authorized
- [ ] Pastikan redirect ke login
- [ ] Pastikan error handling yang baik

---

## 🐛 10. REGRESSION TESTING

### 10.1 Header Component

- [ ] **BPJS Status Badge:**
  - [ ] Muncul jika klinik pakai BPJS
  - [ ] Tidak muncul jika klinik tidak pakai BPJS
  - [ ] Status badge update sesuai kondisi
  - [ ] Loading state berfungsi
- [ ] **Account Dropdown:**
  - [ ] Klik avatar → dropdown muncul
  - [ ] Menu "Profil" berfungsi
  - [ ] Menu "Keluar Akun" berfungsi
- [ ] **Sleekplan Button:**
  - [ ] Klik icon info → iframe muncul
  - [ ] Iframe ter-load dengan benar

### 10.2 Sidebar Component

- [ ] **Menu Navigation:**
  - [ ] Semua menu muncul sesuai role
  - [ ] Klik menu → navigation berfungsi
  - [ ] Active state berfungsi
- [ ] **Clinic Switcher:**
  - [ ] Dropdown klinik muncul
  - [ ] List klinik ter-load
  - [ ] Switch klinik berfungsi
  - [ ] Selected state berfungsi

### 10.3 General UI/UX

- [ ] Tidak ada console error
- [ ] Tidak ada console warning
- [ ] Loading state berfungsi di semua halaman
- [ ] Error state berfungsi di semua halaman
- [ ] Empty state berfungsi di semua halaman
- [ ] Toast notification berfungsi
- [ ] Modal berfungsi dengan benar
- [ ] Form validation berfungsi
- [ ] Button disabled state berfungsi

### 10.4 Performance

- [ ] Page load time tidak menurun
- [ ] API response time normal
- [ ] No memory leak
- [✅] Smooth scrolling
- [✅] No UI lag

---

## 📊 11. TEST EXECUTION TRACKING

### Test Summary

- **Total Test Cases:** ~150+
- **Passed:** \_\_\_
- **Failed:** \_\_\_
- **Blocked:** \_\_\_
- **Not Tested:** \_\_\_

### Test Environment

- **Environment:** [Dev / Staging / Production]
- **Base URL:** ******\_\_\_******
- **Test Date:** ******\_\_\_******
- **Tester Name:** ******\_\_\_******

### Browser Tested

- [ ] Chrome **\_** (version)
- [ ] Firefox **\_** (version)
- [ ] Safari **\_** (version)
- [ ] Edge **\_** (version)

### Devices Tested

- [ ] Desktop (Windows)
- [ ] Desktop (Mac)
- [ ] Tablet
- [ ] Mobile

---

## 🐛 12. BUG REPORT TEMPLATE

### Bug #1

- **Title:** ******\_\_\_******
- **Severity:** [Critical / High / Medium / Low]
- **Priority:** [P0 / P1 / P2 / P3]
- **Steps to Reproduce:**
  1. ***
  2. ***
  3. ***
- **Expected Result:** ******\_\_\_******
- **Actual Result:** ******\_\_\_******
- **Screenshot/Video:** ******\_\_\_******
- **Console Error:** ******\_\_\_******
- **Browser:** ******\_\_\_******
- **Environment:** ******\_\_\_******

---

## ✅ 13. SIGN-OFF

### QA Sign-off

- [ ] All critical test cases passed
- [ ] All high priority test cases passed
- [ ] All bugs documented
- [ ] Test report submitted

**QA Name:** ******\_\_\_******  
**Date:** ******\_\_\_******  
**Signature:** ******\_\_\_******

### Developer Sign-off

- [ ] All bugs fixed
- [ ] Code reviewed
- [ ] Ready for deployment

**Developer Name:** ******\_\_\_******  
**Date:** ******\_\_\_******  
**Signature:** ******\_\_\_******

---

## 📝 14. NOTES & OBSERVATIONS

### Additional Notes

- ***
- ***
- ***

### Known Issues

- ***
- ***
- ***

### Recommendations

- ***
- ***
- ***

---

**End of QA Testing Checklist**
