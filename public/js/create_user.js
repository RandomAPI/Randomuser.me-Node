(function() {
  domready(function() {
    if (document.title.indexOf('Home') !== -1) {
      getNewUser();

      var liList = Array.prototype.slice.call(document.getElementById("values_list").getElementsByTagName('li'));
      liList.forEach(function(el) {
        el.addEventListener('mouseover', function() {
          liList.forEach(function(el) {
            el.className = el.className.replace(/\bactive\b/,'');
          });
          var item = this;
          item.className += ' active';

          document.getElementById('user_title').innerHTML = item.getAttribute('data-title');
          document.getElementById('user_value').innerHTML = item.getAttribute('data-value');
          
          if(item.getAttribute('data-caps')){
            document.getElementById('user_value').style.textTransform = "lowercase";
          } else {
            document.getElementById('user_value').style.textTransform = "capitalize";
          }
        });
      });
    }
  });
})();

function getNewUser(){
  var lego = "";
  if (document.body.classList.contains('lego')) {
    lego = "&lego";
  }

  var result = pegasus('https://randomuser.me/api/?nat=us&randomapi' + lego);

  result.then(function(data) {
    if (!data['error']){
      var user = data.results[0];

      // Assign Data
      document.getElementById('user_photo').getElementsByTagName('img')[0].src = user.picture.large;
      
      setData('name', user.name.first+' '+user.name.last);

      document.getElementById('user_value').innerHTML = user.name.first+' '+user.name.last;

      setData('email', user.email);

      var birthday = new Date(user.dob.date);
      setData('birthday', birthday.getMonth() + 1 + '/' + (birthday.getDay() + 1) + '/19' + birthday.getYear());
      setData('location', user.location.street.number + " " + user.location.street.name);
      setData('phone', user.cell);
      setData('pass', user.login.password);
    } else {
      // Error
    }
  });

  function setData(label, value) {
    var liList = Array.prototype.slice.call(document.getElementsByTagName('li'));

    liList.find(function(el) {
      return el.getAttribute('data-label') === label;
    }).setAttribute('data-value', value);
  }
}
