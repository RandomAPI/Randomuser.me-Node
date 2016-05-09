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

      var menNums = randomNums(95);
      var womenNums = randomNums(95);
      var legoNums = randomNums(9); // Legos are people too

      for (var i = 0; i <= 99; i++) {
        createImage(menNums[i], 'men');
      }

      for (var i = 0; i <= 95; i++) {
        createImage(womenNums[i], 'women');
      }

      for (var i = 0; i <= 9; i++) {
        createImage(legoNums[i], 'lego');
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

  // It's <insert year here>, gotta be PC
  function randomNums(amt) {
    function shuffle(array) {
      var m = array.length, t, i;

      // While there remain elements to shuffle…
      while (m) {

        // Pick a remaining element
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }

      return array;
    }
    return shuffle(new Array(amt).fill(0).map(function(v, i) { return i; }));
  }
})();