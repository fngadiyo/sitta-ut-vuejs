(function () {
  var jam = new Date().getHours();
  var sapaan = 'Selamat malam';

  if (jam >= 5 && jam < 11) {
    sapaan = 'Selamat pagi';
  } else if (jam >= 11 && jam < 15) {
    sapaan = 'Selamat siang';
  } else if (jam >= 15 && jam < 18) {
    sapaan = 'Selamat sore';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var target = document.getElementById('sapaan');
    if (target) {
      target.textContent = sapaan;
    }
  });
})();
