$(document).ready(function(){

  api_url = 'https://randomuser.me/api/0.4/?randomapi';

  getNewUser(api_url);

    $('#values_list li').hover(function(){
     $('#values_list li').removeClass('active');
        var item = $(this);
          item.addClass('active');
          $('#user_title').html(item.attr('data-title'));
          $('#user_value').html(item.attr('data-value'));
          
          if(item.attr('data-caps')){
            $('#user_value').css({'text-transform': 'lowercase'});
          } else {
            $('#user_value').css({'text-transform': 'capitalize'});
          }
    });
});

function getNewUser(location){
  $.ajax({
    url: location,
    dataType: 'json',
    success: function(data){
      if(!data['error']){
        var user = data.results[0].user;
        // Update to SSL picture
        user.picture = user.picture.replace("http://api.", "https://");
        user.picture = user.picture.replace(".me/", ".me/api/");
      
        // Assign Data
        $('#user_photo img').attr('src', user.picture.replace("portraits/", "portraits/med/"));
        
        $('li[data-label="name"]').attr('data-value', user.name.first+' '+user.name.last);
        $('#user_value').html(user.name.first+' '+user.name.last);

        $('li[data-label="email"]').attr('data-value', user.email);

        var birthday = new Date(user.dob*1000);
        $('li[data-label="birthday"]').attr('data-value', birthday.getMonth()+1+'/'+(birthday.getDay()+1)+'/19'+birthday.getYear());

        $('li[data-label="location"]').attr('data-value', user.location.street);
        $('li[data-label="phone"]').attr('data-value', user.cell);
        $('li[data-label="pass"]').attr('data-value', user.password);
      } else {
        // Error
      }
    }
  });
}