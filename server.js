var fs     = require('fs');
var async  = require('async');
var server = require('./app').server;
var app    = require('./app').app;

Generator = {};
datasets  = {};
injects   = {};
clients   = {};

// Load in all generators and datasets before starting the server
// Scan api folder for available versions
var versions = fs.readdirSync('./api').filter(dir => dir !== '.DS_Store');

async.forEachOf(versions, (value, key, callback) => {
  require('./api/' + value + '/loadDatasets')(data => {
    Generator[value] = require('./api/' + value + '/api');
    datasets[value]  = data;
    callback();
  });
}, function(err, results) {
    startServer();
});

function startServer() {
  server.listen(app.get('port'));
  server.on('error', error => {
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

  server.on('listening', () => {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log('Listening on ' + bind);
  });

  // Client limit reset
  setInterval(() => {
    clients = {};
  }, settings.resetInterval);
}
