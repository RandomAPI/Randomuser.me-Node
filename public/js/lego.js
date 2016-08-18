(function() {
  if (document.title.indexOf('Home') !== -1) {
    var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
    document.addEventListener('keydown', function(e) {
      kkeys.push(e.keyCode);

      if (kkeys.toString().indexOf(konami) >= 0) {
        kkeys = [];
        document.getElementsByTagName('header')[0].getElementsByTagName('h1')[0].innerHTML = 'Random Lego Generator';
        document.getElementsByTagName('body')[0].className += " lego";
        window.scrollTo(0, 0);
        getNewUser();
      }
    });
  }
})();
