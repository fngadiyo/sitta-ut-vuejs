(function () {
  var PARAM = "sidebar";
  var KUNCI = "sitta.sidebar.tugas2";
  var ciut = null;

  try {
    var nilai = new URL(window.location.href).searchParams.get(PARAM);
    if (nilai !== null) {
      ciut = nilai === "1";
    }
  } catch (error) {
    ciut = null;
  }

  if (ciut === null) {
    try {
      ciut = window.localStorage.getItem(KUNCI) === "1";
    } catch (error) {
      ciut = false;
    }
  }

  if (ciut) {
    document.documentElement.classList.add("sidebar-collapsed");
  }
})();
