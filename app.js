const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const bodyParser   = require('body-parser');
const http         = require('http');
const compress     = require('compression');
const cors         = require('cors');

const db       = require('./models/db')
const index    = require('./routes/index');
const api      = require('./routes/api');
const stats    = require('./routes/stats');
const settings = require('./settings');
const store    = require('./store');

const app    = express();
const server = http.createServer(app);

// view engine setup
app.set('views', path.join(__dirname, '.viewsMin'));
app.set('view engine', 'ejs');

// middleware
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.png')));
app.set('port', settings.port);
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compress());

// routes
app.use('/', index);
app.use('/api', api);
app.use('/getStats', stats);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(err.status || 500);
});

// Load and initialize generators before starting server
(async() => {
  await db(process.env.spec);
  await require('./loadGenerators')();
  require('./sockets.js')(server);
  startServer();
})();

store.set('clients', {});
let clients = store.get('clients');

// Client limit reset
setInterval(() => {
  let offenders = {};
  Object.keys(clients).forEach(client => {
    if (clients[client] >= settings.limit) {
        offenders[client] = clients[client];
    }
  });
  if (Object.keys(offenders).length > 0) console.log(offenders);

  clients = {};
  store.set('clients', clients);
  if (process.env.spec !== "true") global.gc();
}, settings.resetInterval);

function startServer() {
  server.listen(app.get('port'));
  
  server.on('error', error => {
    let bind = app.get('port');
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
    let addr = server.address();
    let bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log('Listening on ' + bind);
    server.emit("serverStarted");
  });
}

module.exports = {
  app,
  server,
};