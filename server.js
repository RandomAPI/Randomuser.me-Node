var async    = require("async");
var server   = require('./app').server;
var app      = require('./app').app;
Generator = {};
datasets  = {};
injects   = {};

// Load in all generators and datasets before starting the server
async.parallel({
  "1_0": function(callback) {
    require('./api/1.0/loadDatasets')(function(data) {
      Generator["1.0"] = require('./api/1.0/api');
      datasets["1.0"]  = data;
      callback();
    });
  }
},
function(err, results) {
    startServer();
});

function startServer() {
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
}
