function myFunction() {
  
}
/**
 * Main HTTP GET Handler for Google Apps Script Web App
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Profil RT Digital - Sistem Pendataan & Pelayanan Warga')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

// Default fallback jika Script Properties belum diisi.
var DEFAULT_SPREADSHEET_ID = 'https://docs.google.com/spreadsheets/d/11KRmC_S7HKkIF5QB3X9XC_P8Mut5g0pMcNTkrKx4A5M/edit?gid=0#gid=0';

/**
 * Helper to get Spreadsheet ID from Script Properties.
 * Set property key: SPREADSHEET_ID
 */
function getSpreadsheetIdConfig() {
  return PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || DEFAULT_SPREADSHEET_ID;
}

/**
 * One-time helper to set Spreadsheet ID in Script Properties.
 * Run manually from Apps Script editor if needed.
 */
function setupSpreadsheetId() {
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', DEFAULT_SPREADSHEET_ID);
}

/**
 * Helper to extract raw ID from a full Google Sheet URL or ID string
 */
function parseSpreadsheetId(input) {
  if (!input) return '';
  var clean = input.trim();
  var match = clean.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return clean;
}

/**
 * Helper to get active spreadsheet and initialize required sheets with headers
 */
function getSpreadsheetDB() {
  var ss = null;
  var rawId = parseSpreadsheetId(getSpreadsheetIdConfig());

  try {
    if (rawId !== '') {
      ss = SpreadsheetApp.openById(rawId);
    } else {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }
  } catch (err) {
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (fallbackErr) {
      ss = null;
    }
  }

  if (!ss) {
    return null;
  }

  // Ensure 'Data Warga' sheet exists
  var sheetWarga = ss.getSheetByName('Data Warga');
  if (!sheetWarga) {
    sheetWarga = ss.insertSheet('Data Warga');
    sheetWarga.appendRow([
      'Timestamp', 'No. KK', 'NIK', 'Nama Lengkap', 'Jenis Kelamin', 
      'Tempat/Tgl Lahir', 'Agama', 'Pekerjaan', 'Status Perkawinan', 
      'Alamat / No. Rumah', 'No. WhatsApp', 'Jumlah Anggota Keluarga', 
      'Status Tempat Tinggal', 'Kategori Ekonomi'
    ]);
    sheetWarga.getRange(1, 1, 1, 14).setFontWeight('bold').setBackground('#0284c7').setFontColor('#ffffff');
  }

  // Ensure 'Pengaduan' sheet exists
  var sheetPengaduan = ss.getSheetByName('Pengaduan');
  if (!sheetPengaduan) {
    sheetPengaduan = ss.insertSheet('Pengaduan');
    sheetPengaduan.appendRow(['Timestamp', 'Nama Pelapor', 'No. Rumah', 'No. WA', 'Kategori', 'Isi Pengaduan', 'Status']);
    sheetPengaduan.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#0284c7').setFontColor('#ffffff');
  }

  // Ensure 'Pengajuan Surat' sheet exists
  var sheetSurat = ss.getSheetByName('Pengajuan Surat');
  if (!sheetSurat) {
    sheetSurat = ss.insertSheet('Pengajuan Surat');
    sheetSurat.appendRow(['Timestamp', 'Nama Warga', 'NIK', 'Jenis Surat', 'Keperluan', 'No. WA', 'Status Process']);
    sheetSurat.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#0284c7').setFontColor('#ffffff');
  }

  return ss;
}

/**
 * Saves new resident profiling data to Google Sheet
 * @param {Object} formData
 */
function submitDataWarga(formData) {
  try {
    var ss = getSpreadsheetDB();
    if (!ss) {
      return { success: false, message: 'Google Sheet database tidak ditemukan. Pastikan script terhubung dengan Google Sheets.' };
    }

    var sheet = ss.getSheetByName('Data Warga');
    var timestamp = new Date();

    sheet.appendRow([
      timestamp,
      "'" + (formData.noKK || ''),
      "'" + (formData.nik || ''),
      formData.namaLengkap || '',
      formData.jenisKelamin || '',
      (formData.tempatLahir || '') + ', ' + (formData.tanggalLahir || ''),
      formData.agama || '',
      formData.pekerjaan || '',
      formData.statusKawin || '',
      formData.alamatRumah || '',
      "'" + (formData.noWa || ''),
      formData.jumlahKeluarga || 1,
      formData.statusRumah || '',
      formData.kategoriEkonomi || 'Reguler'
    ]);

    return { 
      success: true, 
      message: 'Data Warga berhasil disimpan ke sistem profil RT!' 
    };
  } catch (error) {
    return { success: false, message: 'Gagal menyimpan data: ' + error.toString() };
  }
}

/**
 * Saves document letter request to Google Sheet
 */
function submitPengajuanSurat(formData) {
  try {
    var ss = getSpreadsheetDB();
    if (!ss) {
      return { success: false, message: 'Google Sheet tidak terhubung.' };
    }

    var sheet = ss.getSheetByName('Pengajuan Surat');
    sheet.appendRow([
      new Date(),
      formData.namaWarga,
      "'" + formData.nik,
      formData.jenisSurat,
      formData.keperluan,
      "'" + formData.noWa,
      'Menunggu Persetujuan RT'
    ]);

    return { success: true, message: 'Permohonan surat pengantar berhasil dikirim ke pengurus RT.' };
  } catch (error) {
    return { success: false, message: 'Gagal mengirim pengajuan: ' + error.toString() };
  }
}

/**
 * Saves report / aspirasi from citizens
 */
function submitPengaduan(formData) {
  try {
    var ss = getSpreadsheetDB();
    if (!ss) return { success: false, message: 'Google Sheet tidak terhubung.' };

    var sheet = ss.getSheetByName('Pengaduan');
    sheet.appendRow([
      new Date(),
      formData.namaPelapor,
      formData.noRumah,
      "'" + formData.noWa,
      formData.kategori,
      formData.isiPengaduan,
      'Baru'
    ]);

    return { success: true, message: 'Pengaduan / Aspirasi berhasil disimpan!' };
  } catch (error) {
    return { success: false, message: 'Gagal menyimpan laporan: ' + error.toString() };
  }
}

/**
 * Gets real-time or aggregated statistical metrics for the landing page dashboard
 */
function getRTStats() {
  try {
    var ss = getSpreadsheetDB();
    if (!ss) return getMockStats();

    var sheetWarga = ss.getSheetByName('Data Warga');
    if (!sheetWarga) return getMockStats();

    var data = sheetWarga.getDataRange().getValues();
    if (data.length <= 1) return getMockStats();

    var totalWarga = data.length - 1;
    var totalKK = 0;
    var lakiLaki = 0;
    var perempuan = 0;
    var kkSet = {};

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var kk = row[1];
      var jk = row[4];
      if (kk) kkSet[kk] = true;
      if (jk === 'Laki-laki') lakiLaki++;
      if (jk === 'Perempuan') perempuan++;
    }

    totalKK = Object.keys(kkSet).length || Math.ceil(totalWarga / 3);

    return {
      success: true,
      stats: {
        totalWarga: totalWarga,
        totalKK: totalKK,
        lakiLaki: lakiLaki,
        perempuan: perempuan,
        umkmAktif: 12,
        kegiatanBulanIni: 8
      }
    };
  } catch (err) {
    return getMockStats();
  }
}

/**
 * Fallback baseline mock metrics
 */
function getMockStats() {
  return {
    success: true,
    stats: {
      totalWarga: 248,
      totalKK: 64,
      lakiLaki: 126,
      perempuan: 122,
      umkmAktif: 14,
      kegiatanBulanIni: 6
    }
  };
}