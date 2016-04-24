var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var http         = require('http');
var compress     = require('compression');
var debug        = require('debug')('randomuser.me-node:server');
var cors         = require('cors');

var db           = require('./models/db')(process.env.spec);
var index        = require('./routes/index');
var api          = require('./routes/api');
var stats        = require('./routes/stats');

var app          = express();
var server       = http.createServer(app);
settings         = require('./settings');

// view engine setup
app.set('views', path.join(__dirname, '.viewsMin'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.png')));
app.set('port', settings.port);
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compress());

app.use('/', index);
app.use('/api/portraits', express.static('public/portraits'));
app.use('/api', api);
app.use('/getStats', stats);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.sendStatus(err.status || 500);
});

module.exports = {
  server,
  app
};
