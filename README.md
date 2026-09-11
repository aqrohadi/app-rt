# Profil RT Digital

Aplikasi web berbasis Google Apps Script untuk portal informasi, pendataan, dan pelayanan warga RT 005 / RW 012 Kelurahan Sejahtera.

## Tujuan Aplikasi

Aplikasi ini dibuat untuk membantu pengurus RT mengelola data warga dan layanan administrasi secara digital memakai Google Sheets sebagai database.

## Fungsi Utama

- Portal profil RT digital.
- Statistik jumlah warga, KK, laki-laki, perempuan, UMKM, kegiatan.
- Form pendataan warga.
- Form pengajuan surat pengantar.
- Form pengaduan / aspirasi warga.
- Direktori UMKM warga.
- Informasi kegiatan dan pengumuman RT.
- Penyimpanan data otomatis ke Google Sheets.

## Scope Aplikasi

### Termasuk

- Frontend landing page warga.
- Backend Google Apps Script.
- Database Google Sheets.
- Deploy sebagai Google Apps Script Web App.
- Akses publik untuk warga melalui link web app.

### Tidak Termasuk

- Login warga.
- Role admin dashboard khusus.
- Upload file lampiran.
- Verifikasi NIK otomatis Dukcapil.
- Notifikasi WhatsApp otomatis.
- Payment/iuran online.

## Teknologi / Bahasa

- Google Apps Script JavaScript runtime V8.
- HTML.
- Tailwind CSS CDN.
- FontAwesome CDN.
- Chart.js CDN.
- Google Sheets sebagai database.
- clasp untuk development lokal dan deploy.

## Struktur File

```text
.
├── appsscript.json   # Konfigurasi Apps Script
├── code.js           # Backend Apps Script: doGet, submit form, statistik
├── index.html        # Frontend aplikasi web
├── .clasp.json       # Konfigurasi clasp Script ID
├── .gitignore        # Ignore file Git
└── README.md         # Dokumentasi project
```

## Database Google Sheets

Aplikasi memakai spreadsheet berikut sebagai database:

```text
https://docs.google.com/spreadsheets/d/11KRmC_S7HKkIF5QB3X9XC_P8Mut5g0pMcNTkrKx4A5M/edit
```

Sheet otomatis dibuat jika belum ada:

### Data Warga

Kolom:

- Timestamp
- No. KK
- NIK
- Nama Lengkap
- Jenis Kelamin
- Tempat/Tgl Lahir
- Agama
- Pekerjaan
- Status Perkawinan
- Alamat / No. Rumah
- No. WhatsApp
- Jumlah Anggota Keluarga
- Status Tempat Tinggal
- Kategori Ekonomi

### Pengaduan

Kolom:

- Timestamp
- Nama Pelapor
- No. Rumah
- No. WA
- Kategori
- Isi Pengaduan
- Status

### Pengajuan Surat

Kolom:

- Timestamp
- Nama Warga
- NIK
- Jenis Surat
- Keperluan
- No. WA
- Status Process

## Prasyarat Install

- Akun Google.
- Akses ke project Google Apps Script.
- Akses ke Google Sheets database.
- Node.js dan npm.
- clasp sudah terinstall.

## Install clasp

```bash
npm install -g @google/clasp
```

Login ke akun Google:

```bash
clasp login
```

## Clone Project

Script ID project:

```text
1Vtog0R6Jfp21xKzWYUwbMhdtX3rjgM_nuTJE9_MOPd47kM7tTqbF9GNR
```

Clone:

```bash
clasp clone 1Vtog0R6Jfp21xKzWYUwbMhdtX3rjgM_nuTJE9_MOPd47kM7tTqbF9GNR
cd app-rt
```

Jika folder sudah ada, cukup cek status:

```bash
clasp status
```

## Cara Menjalankan Lokal untuk Development

Google Apps Script tidak berjalan sebagai server lokal biasa. Alur development:

1. Edit file lokal:

```bash
code.js
index.html
appsscript.json
```

2. Push perubahan ke Apps Script:

```bash
clasp push
```

3. Buka editor Apps Script:

```bash
clasp open
```

4. Jalankan / test dari Apps Script editor atau deployment web app.

## Step-by-step Deploy Web App

1. Pastikan sudah login:

```bash
clasp login
```

2. Push kode terbaru:

```bash
clasp push
```

3. Buka Apps Script:

```bash
clasp open
```

4. Klik **Deploy**.
5. Pilih **New deployment** atau **Manage deployments**.
6. Pilih type **Web app**.
7. Isi konfigurasi:

```text
Execute as: Me / User deploying
Who has access: Anyone
```

8. Klik **Deploy**.
9. Authorize permission jika diminta.
10. Copy **Web app URL**.

## Link Akses

### Apps Script Editor

```text
https://script.google.com/d/1Vtog0R6Jfp21xKzWYUwbMhdtX3rjgM_nuTJE9_MOPd47kM7tTqbF9GNR/edit
```

### Google Sheets Database

```text
https://docs.google.com/spreadsheets/d/11KRmC_S7HKkIF5QB3X9XC_P8Mut5g0pMcNTkrKx4A5M/edit
```

### Web App

```text
Isi dengan URL hasil deploy Google Apps Script Web App.
Contoh: https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

## Cara Penggunaan Warga

1. Buka link Web App.
2. Pilih menu sesuai kebutuhan:
   - Beranda
   - Statistik & Profil
   - Layanan Mandiri
   - UMKM Warga
   - Aspirasi
3. Klik **Isi Pendataan Warga** untuk update data.
4. Klik **Buat Surat Pengantar** untuk pengajuan surat.
5. Isi form pengaduan untuk laporan / aspirasi.
6. Data otomatis masuk ke Google Sheets.

## Cara Penggunaan Pengurus RT

1. Buka Google Sheets database.
2. Cek sheet:
   - Data Warga
   - Pengajuan Surat
   - Pengaduan
3. Verifikasi data masuk.
4. Update status pengajuan / pengaduan secara manual di Google Sheets.
5. Rekap data sesuai kebutuhan RT.

## Pengembangan

### Ambil perubahan terbaru dari Apps Script

```bash
clasp pull
```

### Push perubahan lokal

```bash
clasp push
```

### Cek file berubah

```bash
clasp status
```

### Buka Apps Script editor

```bash
clasp open
```

### Deploy versi baru

```bash
clasp deploy --description "Update aplikasi"
```

Atau lewat UI Apps Script: **Deploy > Manage deployments > Edit > New version > Deploy**.

## Konfigurasi Penting

Aplikasi memakai Apps Script **Script Properties** untuk konfigurasi `SPREADSHEET_ID`.

Key:

```text
SPREADSHEET_ID
```

Value bisa berupa ID atau URL Google Sheets:

```text
11KRmC_S7HKkIF5QB3X9XC_P8Mut5g0pMcNTkrKx4A5M
```

atau:

```text
https://docs.google.com/spreadsheets/d/11KRmC_S7HKkIF5QB3X9XC_P8Mut5g0pMcNTkrKx4A5M/edit
```

Cara set manual:

1. Buka Apps Script editor.
2. Masuk **Project Settings**.
3. Cari **Script Properties**.
4. Klik **Add script property**.
5. Isi:

```text
Property: SPREADSHEET_ID
Value: 11KRmC_S7HKkIF5QB3X9XC_P8Mut5g0pMcNTkrKx4A5M
```

Alternatif: jalankan function `setupSpreadsheetId()` sekali dari Apps Script editor untuk mengisi default value.

File `.env.example` hanya contoh konfigurasi lokal. File `.env` tidak dibaca langsung oleh Google Apps Script dan tidak dipush ke repository.

File `appsscript.json`:

```json
{
  "timeZone": "Asia/Jakarta",
  "runtimeVersion": "V8",
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE_ANONYMOUS"
  }
}
```

## Permission Google

Aplikasi membutuhkan izin:

- Membuka dan menulis Google Sheets.
- Menjalankan Google Apps Script Web App.
- Menampilkan HTML service.

## Catatan Keamanan

Data warga berisi NIK, No. KK, alamat, dan nomor WhatsApp. Batasi akses Google Sheets hanya untuk pengurus yang berwenang. Jangan sebarkan link spreadsheet ke publik. Link Web App boleh publik jika form memang untuk warga.

## Maintenance Umum

- Backup Google Sheets berkala.
- Cek data duplikat NIK / No. KK.
- Validasi laporan masuk.
- Update pengumuman dan kegiatan di `index.html`.
- Review permission Apps Script setelah pergantian pengurus.

## Roadmap Pengembangan

- Dashboard admin pengurus RT.
- Login warga / pengurus.
- Fitur pencarian data warga.
- Export laporan PDF.
- Notifikasi WhatsApp.
- Upload dokumen pendukung.
- Validasi form lebih ketat.
- Manajemen UMKM dinamis dari Google Sheets.

## Lisensi

Internal RT 005 / RW 012. Gunakan dan modifikasi sesuai kebutuhan pengurus RT.
