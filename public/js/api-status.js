$.ajax({
    url: 'https://randomuser.me/api/?randomapi',
    dataType: 'json',
    success: function(data) {
      if (data['error']) {
        var _errorBanner = document.createElement('div');
			  _errorBanner.className = 'alert';
			  _errorBanner.innerHTML = 'API Status: OFFLINE. Please tweet us <a href="https://twitter.com/randomapi">@randomapi</a> if you are seeing this message.';
		    $('body').prepend(_errorBanner);
      }
    },
    error: function(data) {
      var _errorBanner = document.createElement('div');
      _errorBanner.className = 'alert';
      _errorBanner.innerHTML = 'API Status: OFFLINE. Please tweet us <a href="https://twitter.com/randomapi">@randomapi</a> if you are seeing this message.';
      $('body').prepend(_errorBanner);
    }
});
