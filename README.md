# Profil RT Digital

Aplikasi portal informasi dan pelayanan warga berbasis Google Apps Script yang digunakan oleh RT 005 / RW 012 Kelurahan Sejahtera. Aplikasi ini menyediakan platform digital bagi warga untuk mengakses informasi RT, mengisi data diri, mengajukan surat pengantar, serta menyampaikan aspirasi — secara online tanpa perlu datang langsung ke rumah pengurus.

## Akses Aplikasi

### Versi Development (Pengujian)

```
https://script.google.com/macros/s/AKfycbzoH7dirPSD8vdW0rha-oZC3fbYTQOaxZv1b5zMEsOh/dev
```

Akses terbatas untuk pengembang. Hanya dapat dibuka oleh akun yang memiliki akses editor pada project Apps Script.

### Versi Production (Publik)

```
https://script.google.com/macros/s/AKfycbwBxP4NSp3r6nw4oy7i44FQzAzHgpM_56TNwu8uBh3VBOZGhyRMJ6bqO-b6HkPMKHjmdg/exec
```

Versi publik yang dapat diakses seluruh warga. Digunakan setelah fitur baru selesai diuji pada versi development.

## Fungsi Utama

Aplikasi menyediakan layanan berikut bagi warga dan pengurus RT:

- **Portal Informasi** — Profil RT, statistik demografis, agenda kegiatan, dan pengumuman.
- **Pendataan Warga** — Form untuk memperbarui atau menambahkan data diri warga.
- **Pengajuan Surat Pengantar** — Permohonan surat pengantar dengan upload dokumen pendukung yang disimpan otomatis ke Google Drive.
- **Aspirasi & Pengaduan** — Form penyampaian laporan, saran, atau keluhan warga dengan validasi data dan notifikasi langsung ke database.
- **Direktori UMKM** — Informasi usaha Mikro, Kecil, dan Menengah milik warga sekitar.

Seluruh data yang diterima dari warga secara otomatis tersimpan ke dalam Google Sheets yang dapat dipantau oleh pengurus RT.

## Ruang Lingkup

### Fitur yang Tersedia

Landing page publik, formulir interaktif, penyimpanan data ke Google Sheets, upload dokumen ke Google Drive, validasi input, dan statistik otomatis.

### Fitur yang Belum Tersedia

Sistem login warga, panel admin khusus, verifikasi NIK secara otomatis melalui Dukcapil, notifikasi WhatsApp otomatis, dan pembayaran iuran secara online.

## Teknologi yang Digunakan

| Komponen | Teknologi |
|----------|-----------|
| Backend | Google Apps Script (JavaScript V8) |
| Frontend | HTML, JavaScript, Tailwind CSS (CDN) |
| Ikon | FontAwesome (CDN) |
| Visualisasi | Chart.js (CDN) |
| Database | Google Sheets |
| Penyimpanan File | Google Drive |
| Deployment | Google Apps Script Web App |
| Development Tool | clasp (CLI) |

## Struktur Project

```
app-rt/
├── appsscript.json    # Konfigurasi project Apps Script
├── code.js            # Kode backend utama
├── index.html         # Tampilan frontend aplikasi
├── .clasp.json        # Identitas project clasp
├── .gitignore         # File yang diabaikan Git
├── docs/
│   └── .env           # Konfigurasi private (tidak di-commit)
└── README.md          # Dokumentasi ini
```

## Database

Aplikasi menggunakan Google Sheets sebagai database utama. Tabel secara otomatis dibuat saat pertama kali fungsi terkait dijalankan jika belum tersedia.

### Sheet: Data Warga

Berisi identitas dan informasi rumah tangga warga. Kolom meliputi Timestamp, Nomor KK, NIK, Nama Lengkap, Jenis Kelamin, Tempat/Tanggal Lahir, Agama, Pekerjaan, Status Perkawinan, Alamat/Nomor Rumah, Nomor WhatsApp, Jumlah Anggota Keluarga, Status Tempat Tinggal, dan Kategori Ekonomi.

### Sheet: Pengaduan

Menyimpan laporan dan aspirasi warga. Kolom meliputi Timestamp, Nama Pelapor, Nomor Rumah, Nomor WhatsApp, Kategori Laporan, Isi Pengaduan, dan Status. Timestamp diformat menggunakan library utilitas dalam bahasa Indonesia.

### Sheet: Pengajuan Surat

Mencatat permohonan surat pengantar dari warga. Kolom meliputi Timestamp, Nama Warga, NIK, Jenis Surat, Keperluan, Nomor WhatsApp, Link Dokumen, Link Folder Drive, dan Status Process. Dokumen yang diupload secara otomatis tersimpan di Google Drive dalam folder terpisah berdasarkan nama dan NIK warga.

## Prasyarat

Sebelum memulai, pastikan Anda memiliki akun Google, akses ke project Apps Script terkait, akses ke Google Sheets database, Node.js yang terinstall, serta clasp yang sudah dikonfigurasi.

## Instalasi

Pasang clasp secara global melalui npm:

```bash
npm install -g @google/clasp
```

Setelah terinstall, login ke akun Google Anda:

```bash
clasp login
```

## Clone Project

Hubungkan project Apps Script ke direktori lokal:

```bash
clasp clone <SCRIPT_ID>
cd app-rt
```

Jika direktori sudah terhubung sebelumnya, cukup perbarui status:

```bash
clasp status
```

## Development Lokal

Alur pengembangan standar:

1. Lakukan perubahan pada file lokal (`code.js`, `index.html`, `appsscript.json`).
2. Push perubahan ke Apps Script:

```bash
clasp push
```

3. Buka editor Apps Script:

```bash
clasp open
```

4. Uji perubahan melalui editor atau URL development.

### Catatan Penting Mengenai Library

Setiap kali `clasp push` dijalankan, referensi library eksternal akan terhapus dari project. Setelah push, library perlu ditambahkan kembali secara manual melalui editor: klik **Resources** → **Libraries** → **Add a library**, masukkan Script ID library, tetapkan identifier sebagai `RTHelperLib`, lalu klik **Add** dan **Save**.

## Deploy Web App

Proses deployment ke server Google:

1. Pastikan sudah login:

```bash
clasp login
```

2. Push kode terbaru:

```bash
clasp push
```

3. Pastikan library `RTHelperLib` sudah ditambahkan (lihat catatan di atas).
4. Buka editor Apps Script:

```bash
clasp open
```

5. Klik **Deploy** → **Manage deployments** → **New deployment**.
6. Pilih type **Web app**.
7. Atur **Execute as** ke `Me` dan **Who has access** ke `Anyone`.
8. Klik **Deploy** dan authorize permission saat diminta.
9. Salin URL web app yang muncul.

### Memperbarui Deployment

Jika ingin memperbarui versi production yang sudah ada:

```bash
clasp deployments
```

Ambil Deployment ID dari hasil perintah, lalu:

```bash
clasp deploy -i "DEPLOYMENT_ID" -d "Deskripsi update"
```

Atau melalui UI: **Manage deployments** → **Edit** → **New version** → **Deploy**.

## Konfigurasi

Aplikasi menggunakan Script Properties untuk menyimpan konfigurasi sensitif.

### Google Sheets ID

ID spreadsheet database dapat diset melalui UI di **Project Settings** → **Script Properties** → **Add script property**, dengan key `SPREADSHEET_ID` dan value berupa ID atau URL lengkap spreadsheet. Alternatif lain adalah menjalankan fungsi `setupSpreadsheetId()` sekali dari editor.

### Folder Google Drive

Folder utama untuk menyimpan dokumen pengajuan surat dapat dikonfigurasi dengan menjalankan:

```javascript
setupDriveFolder('https://drive.google.com/drive/folders/ID_FOLDER_ANDA');
```

Untuk memeriksa apakah konfigurasi folder sudah benar, jalankan:

```javascript
debugScriptProperties();
```

Lalu periksa bagian Logs pada editor.

## Library Utilitas

Aplikasi menggunakan library eksternal `RTHelperLib` yang menyediakan fungsi utilitas untuk format tanggal dalam bahasa Indonesia, format angka ke Rupiah, validasi nomor WhatsApp, dan sanitasi teks terhadap potensi injeksi XSS.

Library ditambahkan melalui editor Apps Script pada menu **Resources** → **Libraries** dengan Script ID yang tersimpan dalam file `docs/.env`.

### Fungsi yang Tersedia

`formatTanggalIndo(date)` menghasilkan tanggal dalam format Indonesia seperti `Sabtu, 12 September 2026 - 08:00 WIB`. `formatRupiah(angka)` menghasilkan format mata uang seperti `Rp 75.000`. `isValidWA(nomor)` mengembalikan nilai true untuk nomor WhatsApp Indonesia yang valid. `melembutkanTeks(teks)` membersihkan karakter HTML untuk mencegah injeksi XSS.

## Keamanan

Beberapa langkah keamanan yang diterapkan meliputi sanitasi seluruh input teks sebelum disimpan ke database, validasi format nomor WhatsApp untuk memastikan data yang tersimpan benar, pembatasan akses Google Sheets hanya untuk pengurus RT, serta tidak dibagikan link spreadsheet ke publik. Web App boleh diakses publik karena hanya menyediakan formulir dan tampilan informasi.

Lakukan backup Google Sheets secara berkala untuk menjaga keamanan data warga.

## Maintenance

Agar aplikasi tetap berjalan optimal, lakukan pengecekan berkala terhadap data duplikat pada kolom NIK dan Nomor KK, perbarui status pengajuan surat dan pengaduan secara manual di spreadsheet, tinjau ulang permission Apps Script jika terjadi pergantian pengurus, serta perbarui library `RTHelperLib` jika terdapat pembaruan fungsi.

## Roadmap

Fitur yang direncanakan untuk pengembangan selanjutnya meliputi dashboard admin bagi pengurus RT, autentikasi warga dan pengurus, pencarian data warga, ekspor laporan dalam format PDF, integrasi notifikasi WhatsApp otomatis, fitur upload dokumen pendukung, serta manajemen direktori UMKM yang dapat diperbarui langsung dari spreadsheet.

## Dokumentasi Lengkap

Untuk dokumentasi teknis yang lebih detail mengenai seluruh fungsi, alur kerja, skema database, dan panduan pemecahan masalah, silakan merujuk pada file `docs/dokumentasi.md`.

## Lisensi

Dikembangkan secara internal untuk RT 005 / RW 012. Silakan gunakan dan modifikasi sesuai kebutuhan pengelolaan RT.
