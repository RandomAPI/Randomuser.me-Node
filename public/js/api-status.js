(function() {
  if (document.title.indexOf('home') !== -1) {
    var result = pegasus('https://randomuser.me/api/?randomapi');
    result.then(function(data) {
      error(data);
    },function (data) {
      error(data);
    });

    var error = function(data) {
      if (data['error']) {
        var _errorBanner = document.createElement('div');
        _errorBanner.className = 'alert';
        _errorBanner.innerHTML = 'API Status: OFFLINE. Please tweet us <a href="https://twitter.com/randomapi">@randomapi</a> if you are seeing this message.';
        var body = document.getElementsByTagName('body')[0];
        body.insertBefore(_errorBanner, body.firstChild);
      }
    };
  }
})();