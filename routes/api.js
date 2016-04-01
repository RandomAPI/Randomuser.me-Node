var fs      = require('fs');
var express = require('express');
var router  = express.Router();
var cors    = require('cors');
var Request = require('../models/Request');

var latestVersion = "1.0";

router.get('/', cors(), function(req, res, next) {
  genUser(req, res, "1.0");
});

router.get('/:version', cors(), function(req, res, next) {
  genUser(req, res, req.params.version);
});

function genUser(req, res, version) {
  version = version || latestVersion;
  if (typeof Generator[version] === 'undefined') {
    res.sendStatus(404);
    return;
  }
  var results = req.query.results || 1;

  new Generator[version](req.query).generate(function(output) {
    var payload = {"bandwidth": output.length};
    payload[version] = results;

    Request.findOrCreate({date: getDateTime()}, payload, function(err, obj, created) {
      res.setHeader('Content-Type', 'application/json');
      // Update record
      if (!created) {
        Request.update({date: getDateTime()}, {$inc: payload}, function(err, blah, a) {
          res.send(output);
        });
      } else {
        res.send(output);
      }
    });
  });
}

module.exports = router;


function getDateTime() {
  var date = new Date();

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return year + "-" + pad(month, 2) + "-" + pad(day, 2);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
