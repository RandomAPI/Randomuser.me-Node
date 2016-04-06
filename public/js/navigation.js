(function() {
  domready(function() {
    addListenerMulti(document.getElementsByClassName('nav_toggle')[0], 'touchstart click', function() {
      document.getElementsByTagName('body')[0].classList.toggle('active');
    });
    window.addEventListener('resize', function() {
      if (document.body.clientWidth > 1145) {
        document.getElementsByTagName('body')[0].className = document.getElementsByTagName('body')[0].className.replace(/\bactive\b/,'');
      }
    })
  });

  function addListenerMulti(el, s, fn) {
    var evts = s.split(' ');
    for (var i=0, iLen=evts.length; i<iLen; i++) {
      el.addEventListener(evts[i], fn, false);
    }
  }
})();