var app = new Vue({
  el: '#app',

  data: {
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
    stok: [
      {
        kode: "EKMA4116",
        judul: "Pengantar Manajemen",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A3",
        harga: 65000,
        qty: 28,
        safety: 20,
        cover: "img/kepemimpinan.jpg",
        catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
      },
      {
        kode: "EKMA4115",
        judul: "Pengantar Akuntansi",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A4",
        harga: 60000,
        qty: 7,
        safety: 15,
        cover: "img/manajemen_keuangan.jpg",
        catatanHTML: "<strong>Cover baru</strong>"
      },
      {
        kode: "BIOL4201",
        judul: "Biologi Umum (Praktikum)",
        kategori: "Praktikum",
        upbjj: "Surabaya",
        lokasiRak: "R3-B2",
        harga: 80000,
        qty: 12,
        safety: 10,
        cover: "img/mikrobiologi.jpg",
        catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
      },
      {
        kode: "FISIP4001",
        judul: "Dasar-Dasar Sosiologi",
        kategori: "MK Pilihan",
        upbjj: "Makassar",
        lokasiRak: "R2-C1",
        harga: 55000,
        qty: 2,
        safety: 8,
        cover: "img/pengantar_komunikasi.jpg",
        catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
      }
    ],
    cari: '',
    filterKategori: '',
    filterUpbjj: '',
    sortBy: '',
    hanyaMenipis: false,
    saranKode: [],
    waktuUpdate: '',
    pesanSukses: '',
    pesanEdit: '',
    editKode: null,
    editForm: {
      qty: '',
      safety: '',
      harga: '',
      lokasiRak: ''
    },
    form: {
      kode: '',
      judul: '',
      kategori: '',
      upbjj: '',
      lokasiRak: '',
      harga: '',
      qty: '',
      safety: ''
    },
    error: {}
  },

  computed: {
    stokTampil: function () {
      var self = this;
      var kataKunci = self.cari.trim().toLowerCase();

      var hasilFilter = self.stok.filter(function (item) {
        var cocokCari = kataKunci === '' ||
          item.kode.toLowerCase().indexOf(kataKunci) !== -1 ||
          item.judul.toLowerCase().indexOf(kataKunci) !== -1;
        var cocokKategori = self.filterKategori === '' || item.kategori === self.filterKategori;
        var cocokUpbjj = self.filterUpbjj === '' || item.upbjj === self.filterUpbjj;
        var cocokMenipis = !self.hanyaMenipis || item.qty === 0 || item.qty < item.safety;

        return cocokCari && cocokKategori && cocokUpbjj && cocokMenipis;
      });

      var hasilUrut = hasilFilter.slice();

      if (self.sortBy === 'judul') {
        hasilUrut.sort(function (a, b) {
          return a.judul.localeCompare(b.judul);
        });
      } else if (self.sortBy === 'stok-asc') {
        hasilUrut.sort(function (a, b) {
          return a.qty - b.qty;
        });
      } else if (self.sortBy === 'stok-desc') {
        hasilUrut.sort(function (a, b) {
          return b.qty - a.qty;
        });
      } else if (self.sortBy === 'harga-asc') {
        hasilUrut.sort(function (a, b) {
          return a.harga - b.harga;
        });
      } else if (self.sortBy === 'harga-desc') {
        hasilUrut.sort(function (a, b) {
          return b.harga - a.harga;
        });
      }

      return hasilUrut;
    },

    totalJudul: function () {
      return this.stok.length;
    },

    totalEksemplar: function () {
      return this.stok.reduce(function (total, item) {
        return total + Number(item.qty);
      }, 0);
    },

    nilaiStok: function () {
      return this.stok.reduce(function (total, item) {
        return total + Number(item.harga) * Number(item.qty);
      }, 0);
    },

    jumlahMenipis: function () {
      return this.stok.filter(function (item) {
        return item.qty === 0 || item.qty < item.safety;
      }).length;
    }
  },

  methods: {
    formatRupiah: function (nilai) {
      var angka = Number(nilai);
      if (!angka || isNaN(angka)) {
        return 'Rp 0';
      }
      return 'Rp ' + angka.toLocaleString('id-ID');
    },

    lebarStok: function (item) {
      var qty = Number(item.qty);
      var safety = Number(item.safety);
      if (!safety || safety <= 0) {
        return 0;
      }
      var persen = (qty / safety) * 100;
      if (persen < 0) {
        return 0;
      }
      if (persen > 100) {
        return 100;
      }
      return Math.round(persen);
    },

    kelasStok: function (item) {
      if (item.qty === 0) {
        return 'is-empty';
      }
      if (item.qty < item.safety) {
        return 'is-low';
      }
      return '';
    },

    resetFilter: function () {
      this.cari = '';
      this.filterKategori = '';
      this.filterUpbjj = '';
      this.sortBy = '';
      this.hanyaMenipis = false;
    },

    resetForm: function () {
      this.form = {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        harga: '',
        qty: '',
        safety: ''
      };
      this.error = {};
    },

    validasiForm: function () {
      var error = {};
      var kode = this.form.kode.trim();
      var judul = this.form.judul.trim();
      var harga = Number(this.form.harga);
      var qty = Number(this.form.qty);
      var safety = Number(this.form.safety);

      if (kode === '') {
        error.kode = 'Kode bahan ajar wajib diisi.';
      } else if (kode.length < 4) {
        error.kode = 'Kode minimal 4 karakter.';
      } else if (this.stok.some(function (item) {
        return item.kode.toLowerCase() === kode.toLowerCase();
      })) {
        error.kode = 'Kode sudah terdaftar, gunakan kode lain.';
      }

      if (judul === '') {
        error.judul = 'Judul wajib diisi.';
      } else if (judul.length < 3) {
        error.judul = 'Judul minimal 3 karakter.';
      }

      if (this.form.kategori === '') {
        error.kategori = 'Kategori wajib dipilih.';
      }

      if (this.form.upbjj === '') {
        error.upbjj = 'UT-Daerah wajib dipilih.';
      }

      if (this.form.lokasiRak.trim() === '') {
        error.lokasiRak = 'Lokasi rak wajib diisi.';
      }

      if (this.form.harga === '' || isNaN(harga) || harga <= 0) {
        error.harga = 'Harga harus berupa angka lebih dari 0.';
      }

      if (this.form.qty === '' || isNaN(qty) || qty < 0 || qty % 1 !== 0) {
        error.qty = 'Qty harus berupa bilangan bulat 0 atau lebih.';
      }

      if (this.form.safety === '' || isNaN(safety) || safety < 0 || safety % 1 !== 0) {
        error.safety = 'Safety harus berupa bilangan bulat 0 atau lebih.';
      }

      this.error = error;
      return Object.keys(error).length === 0;
    },

    tambahStok: function () {
      if (!this.validasiForm()) {
        return;
      }

      this.stok.push({
        kode: this.form.kode.trim(),
        judul: this.form.judul.trim(),
        kategori: this.form.kategori,
        upbjj: this.form.upbjj,
        lokasiRak: this.form.lokasiRak.trim(),
        harga: Number(this.form.harga),
        qty: Number(this.form.qty),
        safety: Number(this.form.safety),
        cover: '',
        catatanHTML: '<em>Ditambahkan melalui formulir</em>'
      });

      this.pesanSukses = 'Bahan ajar ' + this.form.kode.trim() + ' berhasil ditambahkan.';
      this.resetForm();
    },

    mulaiEdit: function (item) {
      this.editKode = item.kode;
      this.editForm.qty = item.qty;
      this.editForm.safety = item.safety;
      this.editForm.harga = item.harga;
      this.editForm.lokasiRak = item.lokasiRak;
      this.pesanEdit = '';
      this.pesanSukses = '';
    },

    batalEdit: function () {
      this.editKode = null;
      this.editForm = {
        qty: '',
        safety: '',
        harga: '',
        lokasiRak: ''
      };
      this.pesanEdit = '';
    },

    simpanEdit: function (item) {
      var qty = Number(this.editForm.qty);
      var safety = Number(this.editForm.safety);
      var harga = Number(this.editForm.harga);
      var lokasiRak = String(this.editForm.lokasiRak).trim();

      if (this.editForm.qty === '' || isNaN(qty) || qty < 0 || qty % 1 !== 0) {
        this.pesanEdit = 'Qty harus berupa bilangan bulat 0 atau lebih.';
        return;
      }

      if (this.editForm.safety === '' || isNaN(safety) || safety < 0 || safety % 1 !== 0) {
        this.pesanEdit = 'Safety harus berupa bilangan bulat 0 atau lebih.';
        return;
      }

      if (this.editForm.harga === '' || isNaN(harga) || harga <= 0) {
        this.pesanEdit = 'Harga harus berupa angka lebih dari 0.';
        return;
      }

      if (lokasiRak === '') {
        this.pesanEdit = 'Lokasi rak wajib diisi.';
        return;
      }

      item.qty = qty;
      item.safety = safety;
      item.harga = harga;
      item.lokasiRak = lokasiRak;

      this.pesanSukses = 'Stok ' + item.kode + ' berhasil diperbarui.';
      this.pesanEdit = '';
      this.editKode = null;
    }
  },

  watch: {
    cari: function (nilai) {
      var kataKunci = nilai.trim().toLowerCase();
      this.pesanSukses = '';

      if (kataKunci.length <= 1) {
        this.saranKode = [];
        return;
      }

      var hasil = [];
      for (var i = 0; i < this.stok.length; i++) {
        var item = this.stok[i];
        if (item.kode.toLowerCase().indexOf(kataKunci) !== -1 ||
          item.judul.toLowerCase().indexOf(kataKunci) !== -1) {
          hasil.push(item.kode);
        }
        if (hasil.length === 3) {
          break;
        }
      }
      this.saranKode = hasil;
    },

    stok: {
      deep: true,
      handler: function () {
        this.waktuUpdate = new Date().toLocaleTimeString('id-ID');
      }
    },

    filterUpbjj: function () {
      this.filterKategori = '';
    }
  },

  created: function () {
    this.waktuUpdate = new Date().toLocaleTimeString('id-ID');
  }
});
