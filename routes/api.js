var fs      = require('fs');
var express = require('express');
var router  = express.Router();
var cors    = require('cors');
var Request = require('../models/Request');

var latestVersion = '1.0';

router.get('/', cors(), (req, res, next) => {
  genUser(req, res, '1.0');
});

router.get('/:version', cors(), (req, res, next) => {
  genUser(req, res, req.params.version);
});

function genUser(req, res, version) {
  version = version || latestVersion;

  // Version doesn't exist
  if (typeof Generator[version] === 'undefined') {
    res.sendStatus(404);
    return;
  }

  var results = req.query.results || 1;
  var dl      = typeof req.query.dl !== 'undefined' || typeof req.query.download !== 'undefined' ? true : false;

  new Generator[version](req.query).generate((output, ext) => {
    var name = "tmp/" + String(new Date().getTime());

    // Download - save file and update headers
    if (dl) {
      res.setHeader('Content-disposition', 'attachment; filename=download.' + ext);
      fs.writeFileSync(name, output, 'utf8');
    } else {
      res.setHeader('Content-Type', 'application/json');
    }

    var payload = {'bandwidth': output.length};
    payload[version] = results;

    Request.findOrCreate({date: getDateTime()}, payload, (err, obj, created) => {
      // Update record
      if (!created) Request.update({date: getDateTime()}, {$inc: payload});

      // Download or output file
      if (dl) {
        res.download(name, "download." + ext, err => {
          fs.unlink(name);
        });
      } else {
        res.send(output);
      }
    });
  });
}

function getDateTime() {
  var date = new Date();

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? '0' : '') + month;

  var day  = date.getDate();
  day = (day < 10 ? '0' : '') + day;

  return year + '-' + pad(month, 2) + '-' + pad(day, 2);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

module.exports = router;
