(function() {
  if (window.location.href.match(/photos$/)) {
    domready(function() {
      var createImage = function(i, g) {
        var thephoto = document.createElement('img');
        thephoto.src = 'https://randomuser.me/api/portraits/' + g + '/' + i + '.jpg';
        thephoto.setAttribute('data-int', i);
        thephoto.setAttribute('data-gender', g);
        console.log(g);
        document.getElementById('photos_' + g).appendChild(thephoto);
      };

      for (var i = 0; i <= 99; i++) {
        createImage(i, 'men');
      }
      for (var i = 0; i <= 95; i++) {
        createImage(i, 'women');
      }
      for (var i = 0; i <= 9; i++) {
        createImage(i, 'lego');
      }

      Array.prototype.slice.call(document.getElementsByTagName('img')).forEach(function(el) {
        el.addEventListener('load', function() {
          this.className += " come_in";
          el.removeEventListener('load', function() {});
        });

        el.addEventListener('click', function() {
          document.getElementById('large_img').setAttribute('src', 'https://randomuser.me/api/portraits/' + this.getAttribute('data-gender') + '/' + this.getAttribute('data-int') + '.jpg');
          fadeIn(document.getElementsByClassName('modal_mask')[0]);
          console.log("fadein");
        });
      })

      document.getElementsByClassName('modal_mask')[0].addEventListener('click', function() {
        document.getElementsByClassName('modal_mask')[0]
        fadeOut(document.getElementsByClassName('modal_mask')[0]);
      });
    });
  }
  // fade out

  function fadeOut(el){
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= .1) < 0) {
        el.style.display = "none";
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }

  // fade in

  function fadeIn(el, display){
    el.style.opacity = 0;
    el.style.display = display || "block";

    (function fade() {
      var val = parseFloat(el.style.opacity);
      if (!((val += .1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }
})();