function hariIni() {
  var d = new Date();
  return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}

var app = new Vue({
  el: '#app',
  data: {
    pengirimanList: [
      { kode: "REG", nama: "Reguler (3-5 hari)" },
      { kode: "EXP", nama: "Ekspres (1-2 hari)" }
    ],
    paket: [
      { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116","EKMA4115"], harga: 120000 },
      { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201","FISIP4001"], harga: 140000 }
    ],
    tracking: {
      "DO2025-0001": {
        nim: "123456789",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        ekspedisi: "JNE",
        tanggalKirim: "2025-08-25",
        paket: "PAKET-UT-001",
        total: 120000,
        perjalanan: [
          { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
          { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
          { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
        ]
      }
    },
    nomorDO: '',
    nomorDICari: '',
    sudahCari: false,
    errorCari: '',
    pesanCari: '',
    riwayat: [],
    formDO: { nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: '' },
    errorBuat: {},
    pesanBuat: ''
  },
  created: function () {
    this.formDO.tanggalKirim = hariIni();
  },
  computed: {
    hasil: function () {
      return this.tracking[this.nomorDICari] || null;
    },
    paketDitemukan: function () {
      if (!this.hasil) {
        return null;
      }
      for (var i = 0; i < this.paket.length; i++) {
        if (this.paket[i].kode === this.hasil.paket) {
          return this.paket[i];
        }
      }
      return null;
    },
    persenStatus: function () {
      if (!this.hasil) {
        return 0;
      }
      if (this.hasil.status === 'Diterima' || this.hasil.status === 'Selesai') {
        return 100;
      }
      if (this.hasil.status === 'Dalam Perjalanan') {
        return 60;
      }
      return 25;
    },
    kelasStatus: function () {
      if (!this.hasil) {
        return 'badge-warn';
      }
      if (this.hasil.status === 'Dalam Perjalanan') {
        return 'badge-info';
      }
      if (this.hasil.status === 'Diterima' || this.hasil.status === 'Selesai') {
        return 'badge-ok';
      }
      return 'badge-warn';
    },
    daftarDO: function () {
      return Object.keys(this.tracking);
    },
    nomorDOBaru: function () {
      var tahun = String(new Date().getFullYear());
      var urutanTerakhir = 0;
      var daftarKunci = Object.keys(this.tracking);
      for (var i = 0; i < daftarKunci.length; i++) {
        var cocok = daftarKunci[i].match(/^DO(\d{4})-(\d+)$/);
        if (cocok && cocok[1] === tahun) {
          var urutan = parseInt(cocok[2], 10);
          if (urutan > urutanTerakhir) {
            urutanTerakhir = urutan;
          }
        }
      }
      return 'DO' + tahun + '-' + ('0000' + (urutanTerakhir + 1)).slice(-4);
    },
    paketBaru: function () {
      for (var i = 0; i < this.paket.length; i++) {
        if (this.paket[i].kode === this.formDO.paket) {
          return this.paket[i];
        }
      }
      return null;
    },
    totalBaru: function () {
      return this.paketBaru ? 'Rp ' + this.paketBaru.harga.toLocaleString('id-ID') : 'Rp 0';
    }
  },
  methods: {
    formatRupiah: function (nilai) {
      return 'Rp ' + nilai.toLocaleString('id-ID');
    },
    pilihDO: function (kode) {
      this.nomorDO = kode;
      this.errorCari = '';
      this.cariDO();
    },
    cariDO: function () {
      var kode = this.nomorDO.toUpperCase();
      if (!/^DO\d{4}-\d{4}$/.test(kode)) {
        this.errorCari = 'Format nomor DO harus seperti DO2025-0001.';
        this.pesanCari = '';
        return;
      }
      this.nomorDICari = kode;
      this.nomorDO = kode;
      this.errorCari = '';
      this.pesanCari = '';
      this.sudahCari = true;
    },
    reset: function () {
      this.nomorDO = '';
      this.nomorDICari = '';
      this.sudahCari = false;
      this.errorCari = '';
      this.pesanCari = '';
    },
    validasiDO: function () {
      var error = {};
      var nim = this.formDO.nim;
      var nama = this.formDO.nama;
      if (nim === '') {
        error.nim = 'NIM wajib diisi.';
      } else if (!/^\d+$/.test(nim)) {
        error.nim = 'NIM hanya boleh berisi angka.';
      } else if (nim.length < 6) {
        error.nim = 'NIM minimal 6 digit.';
      }
      if (nama === '') {
        error.nama = 'Nama wajib diisi.';
      } else if (nama.length < 3) {
        error.nama = 'Nama minimal 3 karakter.';
      }
      if (this.formDO.ekspedisi === '') {
        error.ekspedisi = 'Ekspedisi wajib dipilih.';
      }
      if (this.formDO.paket === '') {
        error.paket = 'Paket bahan ajar wajib dipilih.';
      }
      if (this.formDO.tanggalKirim === '') {
        error.tanggalKirim = 'Tanggal kirim wajib diisi.';
      }
      this.errorBuat = error;
      return Object.keys(error).length === 0;
    },
    buatDO: function () {
      if (!this.validasiDO()) {
        return;
      }
      if (!this.paketBaru) {
        this.errorBuat = { umum: 'Paket bahan ajar tidak dikenali.' };
        return;
      }
      var ekspedisi = null;
      for (var i = 0; i < this.pengirimanList.length; i++) {
        if (this.pengirimanList[i].kode === this.formDO.ekspedisi) {
          ekspedisi = this.pengirimanList[i];
          break;
        }
      }
      if (!ekspedisi) {
        this.errorBuat = { ekspedisi: 'Ekspedisi tidak dikenali.' };
        return;
      }
      var kode = this.nomorDOBaru;
      this.$set(this.tracking, kode, {
        nim: this.formDO.nim,
        nama: this.formDO.nama,
        status: 'Diproses',
        ekspedisi: ekspedisi.kode + ' - ' + ekspedisi.nama,
        tanggalKirim: this.formDO.tanggalKirim,
        paket: this.paketBaru.kode,
        total: this.paketBaru.harga,
        perjalanan: [
          { waktu: new Date().toLocaleString('id-ID'), keterangan: 'Delivery order dibuat dan menunggu proses gudang' }
        ]
      });
      this.pesanBuat = 'Delivery order ' + kode + ' berhasil dibuat.';
      this.nomorDICari = kode;
      this.nomorDO = kode;
      this.sudahCari = true;
      this.resetFormDO();
    },
    resetFormDO: function () {
      this.formDO = { nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: hariIni() };
      this.errorBuat = {};
    }
  },
  watch: {
    nomorDO: function (nilai) {
      var kode = nilai.toUpperCase();
      this.errorCari = '';

      if (kode === this.nomorDICari) {
        return;
      }

      this.sudahCari = false;
      this.nomorDICari = '';
      this.pesanCari = /^DO\d{4}-\d{4}$/.test(kode)
        ? 'Tekan tombol Cari untuk melihat status pengiriman ' + kode + '.'
        : '';
    },
    hasil: function (nilai) {
      if (!nilai) return;
      var kode = this.nomorDICari;
      this.riwayat = [kode].concat(this.riwayat.filter(function (k) { return k !== kode; })).slice(0, 3);
      this.pesanCari = 'Delivery order ' + kode + ' ditemukan.';
    },
    'formDO.paket': function () {
      this.$delete(this.errorBuat, 'paket');
    }
  }
});
