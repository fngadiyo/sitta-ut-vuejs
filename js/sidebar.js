(function () {
  var PARAM = "sidebar";
  var KUNCI = "sitta.sidebar.tugas2";
  var AKAR = document.documentElement;

  function simpan(ciut) {
    try {
      window.localStorage.setItem(KUNCI, ciut ? "1" : "0");
    } catch (error) {
      return;
    }
  }

  function dariUrl() {
    try {
      var nilai = new URL(window.location.href).searchParams.get(PARAM);
      return nilai === null ? null : nilai === "1";
    } catch (error) {
      return null;
    }
  }

  function bersihkanUrl() {
    try {
      var url = new URL(window.location.href);
      if (!url.searchParams.has(PARAM)) {
        return;
      }
      url.searchParams.delete(PARAM);
      window.history.replaceState(null, "", url.pathname.split("/").pop() + url.search + url.hash);
    } catch (error) {
      return;
    }
  }

  function tautanDenganParam(href, ciut) {
    try {
      var url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        return href;
      }
      url.searchParams.set(PARAM, ciut ? "1" : "0");
      return url.pathname.split("/").pop() + url.search + url.hash;
    } catch (error) {
      return href;
    }
  }

  function perbaruiTautan(ciut) {
    var daftar = document.querySelectorAll("a[href]");

    for (var i = 0; i < daftar.length; i++) {
      var tautan = daftar[i];
      var dasar = tautan.getAttribute("data-href-asal") || tautan.getAttribute("href");

      if (!dasar || dasar.charAt(0) === "#" || !/\.html($|[?#])/i.test(dasar)) {
        continue;
      }

      tautan.setAttribute("data-href-asal", dasar);
      tautan.setAttribute("href", tautanDenganParam(dasar, ciut));
    }
  }

  function terapkan(ciut) {
    AKAR.classList.toggle("sidebar-collapsed", ciut);
    perbaruiTautan(ciut);

    var tombol = document.getElementById("sidebarToggle");
    if (!tombol) {
      return;
    }

    tombol.setAttribute("aria-expanded", ciut ? "false" : "true");
    tombol.setAttribute("data-hint", ciut ? "Perluas menu" : "Ciutkan menu");

    var teks = tombol.querySelector(".sidebar-toggle-text");
    if (teks) {
      teks.textContent = ciut ? "Perluas menu" : "Ciutkan menu";
    }
  }

  function ukurMasthead() {
    var masthead = document.querySelector(".masthead");
    if (!masthead) {
      return;
    }
    AKAR.style.setProperty("--tinggi-masthead", Math.round(masthead.getBoundingClientRect().height) + "px");
  }

  var dariUrlState = dariUrl();

  terapkan(dariUrlState === null ? AKAR.classList.contains("sidebar-collapsed") : dariUrlState);

  if (dariUrlState !== null) {
    simpan(dariUrlState);
    bersihkanUrl();
  }

  document.addEventListener("click", function (event) {
    var tombol = event.target.closest ? event.target.closest("#sidebarToggle") : null;
    if (!tombol) {
      return;
    }

    var ciut = !AKAR.classList.contains("sidebar-collapsed");
    terapkan(ciut);
    simpan(ciut);
  });

  document.addEventListener("DOMContentLoaded", function () {
    ukurMasthead();
    terapkan(AKAR.classList.contains("sidebar-collapsed"));
  });

  window.addEventListener("resize", ukurMasthead);
  window.addEventListener("load", ukurMasthead);
})();
