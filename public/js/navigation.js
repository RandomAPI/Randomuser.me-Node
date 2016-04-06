(function() {
  domready(function() {
    addListenerMulti(document.getElementsByClassName('nav_toggle')[0], 'touchstart click', function() {
      document.getElementsByTagName('body')[0].classList.toggle('active');
    });
  });

  function addListenerMulti(el, s, fn) {
    var evts = s.split(' ');
    for (var i=0, iLen=evts.length; i<iLen; i++) {
      el.addEventListener(evts[i], fn, false);
    }
  }
})();