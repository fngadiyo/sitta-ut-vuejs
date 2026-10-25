(function () {
  var bar = null;
  var timer = null;
  var tanpaAnimasi = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function buatBar() {
    if (bar) {
      return bar;
    }
    bar = document.createElement("div");
    bar.className = "loading-bar";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-label", "Memuat halaman");
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    document.body.appendChild(bar);
    return bar;
  }

  function mulaiBar() {
    var el = buatBar();
    clearTimeout(timer);
    el.classList.remove("is-done");
    el.classList.add("is-active");
    el.setAttribute("aria-valuenow", "35");
    timer = setTimeout(function () {
      el.setAttribute("aria-valuenow", "75");
    }, 150);
  }

  function selesaiBar() {
    if (!bar) {
      return;
    }
    clearTimeout(timer);
    bar.classList.remove("is-active");
    bar.classList.add("is-done");
    bar.setAttribute("aria-valuenow", "100");
    setTimeout(function () {
      bar.classList.remove("is-done");
    }, 260);
  }

  function pindah(url) {
    var isi = document.querySelector(".main-content");

    if (tanpaAnimasi || !isi) {
      window.location.href = url;
      return;
    }

    mulaiBar();
    isi.classList.add("page-keluar");
    setTimeout(function () {
      window.location.href = url;
    }, 180);
  }

  function tautanInternal(target) {
    var tautan = target.closest ? target.closest("a[href]") : null;

    if (!tautan || tautan.target === "_blank" || tautan.hasAttribute("download")) {
      return null;
    }

    var href = tautan.getAttribute("href");
    if (!href || href.charAt(0) === "#") {
      return null;
    }
    if (/^[a-z]+:/i.test(href) && !/^\.?\//.test(href)) {
      return null;
    }
    if (!/\.html($|[?#])/i.test(href)) {
      return null;
    }
    return href;
  }

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    var href = tautanInternal(event.target);
    if (!href) {
      return;
    }

    event.preventDefault();
    pindah(href);
  });

  window.addEventListener("pageshow", function (event) {
    if (!event.persisted) {
      return;
    }
    var isi = document.querySelector(".main-content");
    if (isi) {
      isi.classList.remove("page-keluar");
    }
    selesaiBar();
  });

  document.addEventListener("DOMContentLoaded", function () {
    var isi = document.querySelector(".main-content");
    if (isi && !tanpaAnimasi) {
      isi.classList.add("fade-in");
    }
  });
})();
