# Profil RT Digital

Aplikasi web berbasis Google Apps Script untuk portal informasi, pendataan, dan pelayanan warga RT 005 / RW 012 Kelurahan Sejahtera.

## Tujuan Aplikasi

Aplikasi ini dibuat untuk membantu pengurus RT mengelola data warga dan layanan administrasi secara digital memakai Google Sheets sebagai database.

## Fungsi Utama

- Portal profil RT digital.
- Statistik jumlah warga, KK, laki-laki, perempuan, UMKM, kegiatan.
- Form pendataan warga.
- Form pengajuan surat pengantar (upload ke Google Drive).
- Form pengaduan / aspirasi warga (dengan validasi WA, sanitasi XSS).
- Direktori UMKM warga.
- Informasi kegiatan dan pengumuman RT.
- Penyimpanan data otomatis ke Google Sheets.

## Scope Aplikasi

### Termasuk

- Frontend landing page warga.
- Backend Google Apps Script.
- Database Google Sheets.
- Penyimpanan dokumen ke Google Drive.
- Deploy sebagai Google Apps Script Web App.
- Akses publik untuk warga melalui link web app.

### Tidak Termasuk

- Login warga.
- Role admin dashboard khusus.
- Upload file lampiran (form pengajuan surat).
- Verifikasi NIK otomatis Dukcapil.
- Notifikasi WhatsApp otomatis.
- Payment/iuran online.

## Teknologi / Bahasa

- Google Apps Script JavaScript runtime V8.
- HTML / JavaScript frontend.
- Tailwind CSS CDN.
- FontAwesome CDN.
- Chart.js CDN.
- Google Sheets sebagai database.
- Google Drive untuk penyimpanan dokumen.
- clasp untuk development lokal dan deploy.

## Struktur File

```text
.
├── appsscript.json    # Konfigurasi Apps Script (libraries, scopes, webapp)
├── code.js            # Backend Apps Script (semua server-side functions)
├── index.html         # Frontend aplikasi web (HTML + Tailwind + JS)
├── .clasp.json        # Konfigurasi clasp (Script ID)
├── .gitignore         # Ignore file Git
├── docs/
│   └── .env           # Credential private (TIDAK di-commit, lihat catatan)
└── README.md          # Dokumentasi project
```

## Database Google Sheets

Aplikasi memakai spreadsheet tertentu sebagai database.

Sheet otomatis dibuat jika belum ada saat pertama kali fungsi dijalankan.

### Data Warga

Kolom:

| No | Kolom | Keterangan |
|----|-------|------------|
| 1 | Timestamp | Format Indonesia: `Sabtu, 12 September 2026 - 08:00 WIB` |
| 2 | No. KK | Teks |
| 3 | NIK | Teks (diberi prefix `'` agar tidak dibaca sebagai angka) |
| 4 | Nama Lengkap | Teks |
| 5 | Jenis Kelamin | Laki-laki / Perempuan |
| 6 | Tempat/Tgl Lahir | Teks |
| 7 | Agama | Teks |
| 8 | Pekerjaan | Teks |
| 9 | Status Perkawinan | Teks |
| 10 | Alamat / No. Rumah | Teks |
| 11 | No. WhatsApp | Teks |
| 12 | Jumlah Anggota Keluarga | Angka |
| 13 | Status Tempat Tinggal | Teks |
| 14 | Kategori Ekonomi | Teks |

### Pengaduan

Kolom:

| No | Kolom | Keterangan |
|----|-------|------------|
| 1 | Timestamp | Format Indonesia |
| 2 | Nama Pelapor | Teks (sudah disanitasi XSS) |
| 3 | No. Rumah | Teks (sudah disanitasi XSS) |
| 4 | No. WA | Teks |
| 5 | Kategori | Pilihan: Keamanan & Ronda / Kebersihan & Sampah / Lampu Jalan & Saluran Air / Saran Program Kegiatan |
| 6 | Isi Pengaduan | Teks (sudah disanitasi XSS) |
| 7 | Status | Default: `Baru` |

### Pengajuan Surat

Kolom:

| No | Kolom | Keterangan |
|----|-------|------------|
| 1 | Timestamp | Format Indonesia |
| 2 | Nama Warga | Teks |
| 3 | NIK | Teks |
| 4 | Jenis Surat | Teks |
| 5 | Keperluan | Teks |
| 6 | No. WA | Teks |
| 7 | Link Dokumen | URL file di Google Drive |
| 8 | Link Folder Drive | URL folder warga di Google Drive |
| 9 | Status Process | Default: `Menunggu Persetujuan RT` |

## Library: RTHelperLib

Library eksternal digunakan untuk utilitas umum. Library harus ditambahkan manual ke project.

### Menambahkan Library

1. Buka Apps Script Editor.
2. Klik **Resources** → **Libraries**.
3. Klik **Add a library**.
4. Masukkan Script ID library:
   ```
   1-cYgbKHQkp84PxJqp7fjSJntYdxcGYPUeVGaQSJ9aJGTxAKRlBP6Z053
   ```
5. Set **Identifier**: `RTHelperLib`.
6. Set **Version**: `1`.
7. Klik **Add**.
8. **Simpan** project.

### Fungsi Library

#### formatTanggalIndo(date)

Format tanggal ke bahasa Indonesia.

```javascript
// Contoh
RTHelperLib.formatTanggalIndo(new Date());
// Output: "Sabtu, 12 September 2026 - 08:00 WIB"
```

#### formatRupiah(angka)

Format angka ke Rupiah Indonesia.

```javascript
// Contoh
RTHelperLib.formatRupiah(75000);    // "Rp 75.000"
RTHelperLib.formatRupiah(1500000);  // "Rp 1.500.000"
RTHelperLib.formatRupiah(0);        // "Rp 0"
```

#### isValidWA(nomor)

Validasi nomor WhatsApp Indonesia.

```javascript
// Contoh
RTHelperLib.isValidWA("081234567890");    // true
RTHelperLib.isValidWA("6281234567890");   // true
RTHelperLib.isValidWA("081234567");        // false (terlalu pendek)
RTHelperLib.isValidWA("02123456789");     // false (kode area)
```

Format diterima: `08xx`, `628xx`, `+628xx` (8-15 digit setelah prefix).

#### melembutkanTeks(teks)

Sanitasi teks untuk mencegah XSS / HTML injection.

```javascript
// Contoh
RTHelperLib.melembutkanTeks("<script>alert('xss')</script>");
// Output: "&lt;script&gt;alert('xss')&lt;/script&gt;"
```

Digunakan untuk sanitasi `Nama Pelapor`, `No. Rumah`, dan `Isi Pengaduan` sebelum disimpan ke Sheet.

### Test Library

Jalankan dari Apps Script Editor:

```javascript
function tesFungsiLibrary() {
  var tgl = RTHelperLib.formatTanggalIndo(new Date());
  Logger.log(tgl);

  var iuran = RTHelperLib.formatRupiah(75000);
  Logger.log(iuran);

  var wa = "081234567890";
  Logger.log("WA valid: " + RTHelperLib.isValidWA(wa));
}
```

Output Logs diharapkan:

```
Sabtu, 12 September 2026 - 08:00 WIB
Rp 75.000
WA valid: true
```

## Konfigurasi Google Drive (Dokumen Pengajuan Surat)

Dokumen pengajuan surat diupload ke Google Drive. Folder utama harus dikonfigurasi dulu.

### Setup Folder

1. Buka Google Drive → buat folder baru (atau gunakan folder existing).
2. Copy ID folder dari URL:
   ```
   https://drive.google.com/drive/folders/1mx_4tHnOQAPk9kAa3oGYhHrLn57bSynF
   ```
   ID = `1mx_4tHnOQAPk9kAa3oGYhHrLn57bSynF`
3. Buka Apps Script Editor.
4. Jalankan function `setupDriveFolder()` dari dropdown → Run.
   - Masukkan URL atau ID folder saat diminta, atau jalankan langsung:
   ```javascript
   setupDriveFolder('https://drive.google.com/drive/folders/1mx_4tHnOQAPk9kAa3oGYhHrLn57bSynF');
   ```
5. Folder berhasil diset → property `DRIVE_FOLDER_UTAMA_RT_ID` tersimpan.

### Debug Konfigurasi Folder

Jika upload gagal, jalankan:

```javascript
debugScriptProperties();
```

Cek Logs untuk:

- `Parsed folder ID` — ID yang tersimpan
- `Folder found` — nama folder jika valid
- `Folder valid` — `true` / `false`

### Struktur Folder Otomatis

Saat warga submit pengajuan surat:

```
Folder Utama RT
└── [Nama Warga] - [NIK]      ← folder baru per warga
    └── [nama_file_dokumen]   ← file upload
```

Jika folder `[Nama - NIK]` sudah ada, tidak dibuat ulang (pencegahan duplikat).

## Form Aspirasi / Pengaduan

### Validasi

Validasi dilakukan di **dua layer**:

**Frontend (JavaScript):**
- Trim spasi sebelum kirim
- Cek field wajib: Nama, No. Rumah, No. WA, Isi Pengaduan
- Tampilkan toast error jika ada yang kosong

**Backend (Apps Script):**
- Cek field wajib setelah diterima
- Validasi format WA dengan `RTHelperLib.isValidWA()`
- Sanitasi XSS dengan `RTHelperLib.melembutkanTeks()`
- Cek hasil sanitasi tidak kosong

### Alur Simpan

1. User isi form → frontend validasi
2. Payload POST ke `simpanPengaduanWarga(formData)`
3. Backend: validasi WA → sanitasi teks → format tanggal
4. Backend: simpan ke sheet `Pengaduan`
5. Response success/error ke frontend

### Frontend Form Fields

| Field | ID Element | Validasi |
|-------|-----------|----------|
| Nama Pelapor | `aspNama` | Wajib, disanitasi |
| No. Rumah / Blok | `aspRumah` | Wajib, disanitasi |
| No. WhatsApp | `aspWa` | Wajib, format WA |
| Kategori Laporan | `aspKategori` | Dropdown |
| Isi Saran / Laporan | `aspIsi` | Wajib, disanitasi |

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

Clone project ke lokal:

```bash
clasp clone <SCRIPT_ID>
cd app-rt
```

Jika folder sudah ada:

```bash
clasp status
```

## Development Lokal

1. Edit file lokal (`code.js`, `index.html`, `appsscript.json`).
2. Push ke Apps Script:

```bash
clasp push
```

3. Buka editor Apps Script:

```bash
clasp open
```

4. Test dari Apps Script editor atau URL development (`/dev`).

### Catatan Penting: Library RTHelperLib

Setiap `clasp push`, referensi library akan **terhapus** dari project. Setelah push, wajib tambah ulang:

1. **Resources** → **Libraries**.
2. **Add a library** → paste Script ID library.
3. Set identifier: `RTHelperLib`.
4. **Add** → **Save**.

Alternatif: simpankan credential di `docs/.env` dan push tidak akan overwrite library jika tidak diedit dari lokal. Library hanya dikelola via editor UI.

## Deploy Web App

1. Pastikan sudah login:

```bash
clasp login
```

2. Push kode terbaru:

```bash
clasp push
```

3. **Tambahkan library** `RTHelperLib` (jika belum ada).
4. Buka Apps Script:

```bash
clasp open
```

5. Klik **Deploy** → **New deployment** atau **Manage deployments**.
6. Pilih type **Web app**.
7. Konfigurasi:

```
Execute as: Me (User deploying)
Who has access: Anyone
```

8. Klik **Deploy**.
9. Authorize permission.
10. Copy **Web app URL** (production).

### Update Deployment

Jika sudah ada deployment dan ingin update:

```bash
clasp deployments
```

Ambil Deployment ID → update:

```bash
clasp deploy -i "DEPLOYMENT_ID" -d "Update deskripsi"
```

Atau lewat UI: **Manage deployments** → **Edit** → **New version** → **Deploy**.

## Konfigurasi Script Properties

### SPREADSHEET_ID

ID Google Sheets database. Bisa ID atau URL penuh.

Set via UI: **Project Settings** → **Script Properties** → Add property.

Atau jalankan sekali dari editor:

```javascript
setupSpreadsheetId();
```

### DRIVE_FOLDER_UTAMA_RT_ID

ID folder Google Drive untuk simpan dokumen pengajuan surat.

Set:

```javascript
setupDriveFolder('https://drive.google.com/drive/folders/ID_FOLDER_ANDA');
```

Debug:

```javascript
debugScriptProperties();
```

## Struktur Backend (code.js)

### Functions Utama

| Function | Deskripsi |
|----------|-----------|
| `doGet(e)` | HTTP GET handler — serve index.html |
| `submitDataWarga(formData)` | Simpan data warga baru ke sheet |
| `submitPengajuanSurat(formData)` | Upload dokumen + simpan ke sheet |
| `submitPengaduan(formData)` | Simpan pengaduan lama (legacy) |
| `simpanPengaduanWarga(formData)` | Simpan pengaduan baru dengan sanitasi & validasi |
| `getRTStats()` | Ambil statistik warga dari sheet |
| `getRingkasanKas()` | Ambil ringkasan kas RT (format Rupiah) |
| `getSpreadsheetDB()` | Buka/buat spreadsheet database |
| `setupDriveFolder(urlOrId)` | Set folder Drive utama |
| `debugScriptProperties()` | Debug konfigurasi Script Properties |
| `tesFungsiLibrary()` | Test fungsi RTHelperLib |

### Folder & Upload

| Function | Deskripsi |
|----------|-----------|
| `setupDriveFolder(urlOrId)` | Set dan validasi folder utama |
| `validateDriveFolderExists(folderId)` | Cek folder bisa diakses |
| `buatFolderWarga(namaWarga, nik)` | Buat/hapus folder per warga di Drive |
| `uploadDokumenPengajuanSurat(formData)` | Upload file ke folder warga |

## Struktur Frontend (index.html)

### Formulir

| Form | ID Form | Handler |
|------|---------|---------|
| Pendataan Warga | `formWarga` | `handleFormWargaSubmit` |
| Pengajuan Surat | `formSurat` | `handleFormSuratSubmit` |
| Aspirasi / Pengaduan | `formAspirasi` | `handleFormAspirasiSubmit` |

### Validasi Frontend

Setiap form melakukan validasi client-side sebelum kirim:

- Cek field wajib (`required`)
- Trim spasi
- Toast error jika ada yang kosong
- Disable button saat submit untuk cegah double-submit

## Permission Google

Aplikasi membutuhkan izin:

- Membaca & menulis Google Sheets.
- Membuat folder & file di Google Drive.
- Menjalankan Web App.
- Menampilkan HTML.

## Catatan Keamanan

- Data warga berisi NIK, No. KK, alamat, nomor WhatsApp. Batasi akses spreadsheet hanya untuk pengurus.
- Input teks disanitasi (`melembutkanTeks`) sebelum simpan ke Sheet.
- Nomor WA divalidasi formatnya sebelum disimpan.
- Link spreadsheet JANGAN dishare ke publik. Link Web App boleh publik.
- Backup Google Sheets secara berkala.

## Maintenance Umum

- Cek data duplikat NIK / No. KK secara periodik.
- Validasi laporan masuk di sheet `Pengaduan`.
- Update status pengajuan surat di sheet.
- Review permission Apps Script setelah pergantian pengurus.
- Update library `RTHelperLib` jika ada update fungsi.

## Roadmap Pengembangan

- Dashboard admin pengurus RT.
- Login warga / pengurus.
- Fitur pencarian data warga.
- Export laporan PDF.
- Notifikasi WhatsApp otomatis.
- Upload dokumen pendukung.
- Manajemen UMKM dinamis dari Google Sheets.
- Fitur iuran bulanan dengan reminder.

## Catatan Credential & .env

Credential private (Script ID, Spreadsheet ID, Folder ID, dll) **TIDAK boleh di-commit** ke repository.

Simpan di file `docs/.env`. File ini sudah ada di `.gitignore`.

Contoh isi `docs/.env`:

```env
RT_SCRIPT_ID=YOUR_SCRIPT_ID
RT_SPREADSHEET_ID=YOUR_SPREADSHEET_ID
RTHELPERLIB_LIBRARY_ID=YOUR_LIBRARY_ID
DRIVE_FOLDER_UTAMA_RT_ID=YOUR_FOLDER_ID
```

Isi `docs/.env` dengan credential asli. File ini tidak dipush ke repository.

## Lisensi

Internal RT 005 / RW 012. Gunakan dan modifikasi sesuai kebutuhan pengurus RT.
