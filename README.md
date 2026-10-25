# SITTA - Sistem Informasi Tiras dan Transaksi Bahan Ajar

Prototipe antarmuka **front-end** untuk stok bahan ajar dan tracking delivery order Universitas
Terbuka, dibangun sebagai Tugas Praktik 2 mata kuliah **Pemrograman Berbasis Web (STSI4209)**.

Aplikasi ini memakai **Vue.js 2.7.16 dari CDN** di atas HTML, CSS, dan JavaScript biasa: tanpa
back-end, tanpa build step, tanpa Vite/Babel. Setiap halaman adalah satu instance
`new Vue({ el: '#app' })` dengan berkas logika terpisah, dan tidak memakai template component
sesuai ketentuan soal. Seluruh data berasal dari variabel dummy yang diadaptasi dari
`dataBahanAjar.js`.

## Halaman

| Halaman | Berkas | Isi |
| --- | --- | --- |
| Halaman awal | `index.html` | Navigasi ke dua halaman tugas dan ringkasan penerapan Vue.js |
| Stok Bahan Ajar | `stok.html` | Ringkasan stok, filter, sort, tabel dinamis, edit, dan tambah bahan ajar |
| Tracking DO | `tracking.html` | Pencarian status kirim dan pembuatan Delivery Order baru |

## Struktur Berkas

```
tugas2-vue-ut/
├── index.html
├── stok.html
├── tracking.html
├── README.md
├── css/
│   └── style.css            # seluruh tampilan, memakai design token ala MyUT
├── img/                     # logo UT dan sampul contoh bahan ajar
└── js/
    ├── stok-app.js          # logika Vue halaman stok
    ├── tracking-app.js      # logika Vue halaman tracking
    ├── sidebar-preload.js   # menerapkan state sidebar sebelum paint pertama
    ├── sidebar.js           # menu collapsible dan penyimpanan state-nya
    ├── transisi.js          # loading bar dan transisi antar halaman
    └── sapaan.js            # sapaan otomatis sesuai jam lokal
```

Setiap halaman hanya memuat skrip yang dibutuhkannya. `stok-app.js` dan `tracking-app.js`
berisi `data`, `computed`, `methods`, dan `watch` masing-masing halaman, sedangkan empat berkas
lainnya adalah utilitas tampilan yang dipakai bersama.

## Fitur

### Stok Bahan Ajar

- **Ringkasan stok** berupa total judul, total eksemplar (`v-text`), nilai stok, dan jumlah
  judul yang perlu reorder - semuanya computed property.
- **Tabel dinamis** dari `stok` dengan kolom sampul, kode, judul, kategori, UT-Daerah, rak,
  harga, stok/safety, catatan, status, dan aksi.
- **Catatan berformat HTML** dirender dengan `v-html`, kode memakai `v-bind:title`.
- **Pencarian** judul/kode dengan saran kode terkait (watcher).
- **Sort** berdasarkan judul, stok (asc/desc), dan harga (asc/desc). Pengurutan dilakukan pada
  salinan hasil filter sehingga urutan data asli tidak berubah.
- **Filter UT-Daerah** dan **filter Kategori Mata Kuliah** yang baru muncul setelah UT-Daerah
  dipilih (dependent options).
- **Filter perlu reorder** untuk baris dengan `qty < safety` atau `qty = 0`, plus tombol
  **Reset filter**.
- **Status berwarna dan bersimbol**: Aman (hijau), Menipis (oranye), Kosong (merah).
- **Edit stok** langsung di baris tabel (rak, harga, qty, safety) dengan validasi.
- **Tambah bahan ajar** lewat formulir delapan field dengan validasi per field dan pengecekan
  kode duplikat.

### Tracking DO

- **Pencarian nomor DO** lewat tombol Cari atau tombol Enter, lengkap dengan validasi format
  `DO2025-0001`.
- **Panel hasil** berisi nama, NIM, paket, badge status, progress bar pengiriman, detail
  ekspedisi/tanggal/total, isi paket, dan timeline perjalanan.
- **Riwayat pencarian** maksimal tiga nomor DO terakhir.
- **Buat Delivery Order baru**: nomor DO otomatis (`DO` + tahun berjalan + urutan, misal
  `DO2026-0001`), NIM dan nama manual, ekspedisi dari `pengirimanList`, paket lewat `<select>`
  yang menampilkan kode dan nama, detail isi paket muncul di bawah select, tanggal kirim default
  hari ini, dan total harga otomatis dari `paket.harga`.
- Validasi terpisah untuk setiap field formulir pembuatan DO.

### Bersama

- **Greeting dinamis** berdasarkan jam lokal (pagi / siang / sore / malam) tanpa nama pengguna
  karena aplikasi tidak memakai login.
- **Sidebar collapsible.** State disimpan di `localStorage` dan dibawa lewat parameter
  `?sidebar=1` pada setiap tautan, lalu diterapkan oleh `sidebar-preload.js` sebelum paint
  pertama agar tidak ada kedipan saat pindah halaman.
- **Transisi antar halaman** berupa loading bar dan fade-out/fade-in konten, dengan dukungan
  `prefers-reduced-motion`.
- **Tampilan responsif** hingga lebar ponsel; sidebar berubah menjadi bar horizontal di bawah
  900px dan kolom sampul disembunyikan di bawah 760px.

## Penerapan Vue.js

| Kebutuhan soal | Implementasi |
| --- | --- |
| Mustaches, `v-text`, `v-html` | Seluruh tabel stok, kartu ringkasan, dan catatan HTML |
| `v-bind` dan `v-model` | `:src`, `:alt`, `:title`, `:class`, `:style`, `:value`; input pencarian, filter, formulir, dan mode edit |
| `v-if` / `v-else-if` / `v-else` / `v-show` | Badge status, panel hasil/tidak ditemukan/kosong, filter dependent, hint dan alert |
| `v-for` | Tabel stok, opsi paket, isi paket, timeline, riwayat pencarian |
| Computed property | `stokTampil`, `totalJudul`, `totalEksemplar`, `nilaiStok`, `jumlahMenipis`, `hasil`, `persenStatus`, `nomorDOBaru`, `totalBaru` |
| Methods | `formatRupiah`, `lebarStok`, `validasiForm`, `tambahStok`, `simpanEdit`, `cariDO`, `validasiDO`, `buatDO` |
| Watcher (minimal 2) | Stok: `cari`, `stok` (deep), `filterUpbjj`; Tracking: `nomorDO`, `hasil`, `formDO.paket` |
| Formulir dan validasi | Form tambah stok, edit stok, pencarian DO, dan pembuatan DO |

## Menjalankan

Buka `index.html` di peramban. Tidak ada proses build dan tidak ada paket yang perlu dipasang;
Vue dimuat sebagai `<script src>` dari CDN, sehingga koneksi internet diperlukan saat pertama
kali membuka halaman. Jika ingin memakai server lokal, jalankan `npx serve` di folder ini.

## Data Demo

Nomor DO contoh: `DO2025-0001` (Rina Wulandari, status Dalam Perjalanan).
Data stok awal berisi empat judul: EKMA4116, EKMA4115, BIOL4201, dan FISIP4001.
Paket yang tersedia: `PAKET-UT-001` (PAKET IPS Dasar) dan `PAKET-UT-002` (PAKET IPA Dasar).

Untuk mencoba status **Kosong**, tambahkan bahan ajar baru dengan qty `0`.

## Catatan

Karena tugas ini tidak memakai back-end, perubahan data (menambah stok, mengedit stok, membuat
DO) hanya bertahan di memori dan hilang saat halaman dimuat ulang.

Sampul bahan ajar memakai gambar contoh dari Praktik 1, sehingga judul pada gambar tidak selalu
sama dengan judul mata kuliah; pada ukuran 42x58 px teks sampul tidak terbaca dan atribut `alt`
tetap menyebut judul yang benar.

Pilihan ekspedisi mengikuti `pengirimanList` pada data dummy (REG dan EXP), bukan nama kurir.
Nomor DO baru memakai urutan empat digit agar konsisten dengan data contoh `DO2025-0001`.
Tampilan mengacu pada bahasa desain MyUT - memakai token warna dan pola komponennya - agar
terasa familiar, namun disesuaikan untuk versi web.
