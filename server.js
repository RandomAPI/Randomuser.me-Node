var server   = require('./app').server;
var app      = require('./app').app;

// Load in datasets before starting the server
require('./api/loadDatasets')(function(data) {
  api = require('./api/api');
  datasets = data;
  server.listen(app.get('port'));
  server.on('error', function(error) {
    var bind = app.get('port');
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  server.on('listening', function() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log('Listening on ' + bind);
  });
});
