var fs      = require('fs');
var qs      = require('qs');
var express = require('express');
var router  = express.Router();
var Request = require('../models/Request');
var legRequest = require('request');

var latestVersion = '1.2';

router.get('/', (req, res, next) => {
  genUser(req, res, latestVersion);
});

router.get('/:version', (req, res, next) => {
  genUser(req, res, req.params.version);
});

let legacy = {
  "0.1": {
    hash: "916ad3d01e4040cc0a67e0367f887f19",
    max: 5
  },
  "0.2": {
    hash: "74af1a1572d1065ba63f11afb6ba34ee",
    max: 5
  },
  "0.2.1": {
    hash: "d462956eec6157ab03164c565682f3d6",
    max: 5
  },
  "0.3": {
    hash: "cc4b5abca158d7fe0bbb92dcd591114c",
    max: 10
  },
  "0.3.1": {
    hash: "52432a28e766d8142b811436742ec905",
    max: 10
  },
  "0.3.2": {
    hash: "7c25fc35021cdab8bcc0bc20d352a064",
    max: 10
  },
  "0.4": {
    hash: "884bcc24441f39bddfe17e12a080ab7f",
    max: 20
  },
  "0.4.1": {
    hash: "127ee4298ee834d84b33b4ff6f544ed0",
    max: 100
  },
  "0.5": {
    hash: "4111cf8ceae827c5c7659e2ed6238a18",
    max: 100
  },
  "0.6": {
    hash: "418b98dfb9a79a966bf4bb951665856f",
    max: 100
  }
};

function genUser(req, res, version) {
  req.query.fmt = req.query.fmt || req.query.format;

  var ip = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (clients[ip] >= settings.limit) {
    res.status(503).json({
      error: "Whoa, slow down there. You've requested " + clients[ip] + " users in the last minute. Help us keep this service free and spare some bandwidth for other users please :)"
    });
    return;
  }

  version = version || latestVersion;

  // Legacy versions
  if (version in legacy) {
    req.query.results = req.query.results || 1;

    var results = req.query.results;
    if (results > legacy[version].max || results < 1 || isNaN(results) || results % 1 !== 0) {
      results = 1;
      req.query.results = 1;
    }

    if (!(ip in clients)) {
      clients[ip] = Number(req.query.results);
    } else {
      clients[ip] += Number(req.query.results);
    }

    return legRequest(`https://api.randomapi.com/${legacy[version].hash}?noinfo&${qs.stringify(req.query)}`, (err, ret) => {
      if (req.query.fmt === 'json') {
        res.setHeader('Content-Type', 'application/json');
      } else if (req.query.fmt === 'xml') {
        res.setHeader('Content-Type', 'text/xml');
      } else if (req.query.fmt === 'yaml') {
        res.setHeader('Content-Type', 'text/x-yaml');
      } else if (req.query.fmt === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
      } else {
        res.setHeader('Content-Type', 'text/plain');
      }

      res.setHeader('Cache-Control', 'no-cache');

      var payload = {
        'bandwidth': ret.body.length,
        'total': req.query.results
      };
      payload[version.replace(/\./g, '_')] = req.query.results;

      Request.findOrCreate({date: getDateTime()}, payload, (err, obj, created) => {
        // Update record
        if (!created) {
          Request.update({date: getDateTime()}, {$inc: payload}, (err) => {

          });
        }
        res.send(ret.body)
      });
    });
  }

  // Version doesn't exist
  if (typeof Generator[version] === 'undefined') {
    res.sendStatus(404);
    return;
  }

  var results = req.query.results || 1;
  if (results > settings.maxResults || results < 1 || isNaN(results) || results % 1 !== 0) {
    results = 1;
    req.query.results = 1;
  }

  var dl = typeof req.query.dl !== 'undefined' || typeof req.query.download !== 'undefined' ? true : false;

  if (!(ip in clients)) {
    clients[ip] = Number(results);
  } else {
    clients[ip] += Number(results);
  }

  if (req.query.extension === "true") {
    req.query.nat = "us,gb"
  }

  new Generator[version](req.query).generate((output, ext) => {
    var name = "tmp/" + String(new Date().getTime());

    if (typeof req.query.callback !== 'undefined' && ext === "json") {
      output = String(req.query.callback) + "(" + output + ");";
    }

    // Download - save file and update headers
    if (dl) {
      res.setHeader('Content-disposition', 'attachment; filename=download.' + ext);
      fs.writeFileSync(name, output, 'utf8');
    } else {
      if (ext === 'json') {
        res.setHeader('Content-Type', 'application/json');
      } else if (ext === 'xml') {
        res.setHeader('Content-Type', 'text/xml');
      } else if (ext === 'yaml') {
        res.setHeader('Content-Type', 'text/x-yaml');
      } else if (ext === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
      } else {
        res.setHeader('Content-Type', 'text/plain');
      }
    }

    res.setHeader('Cache-Control', 'no-cache');

    var payload = {
      'bandwidth': output.length,
      'total': results
    };
    payload[version.replace(/\./g, '_')] = results;

    Request.findOrCreate({date: getDateTime()}, payload, (err, obj, created) => {
      // Update record
      if (!created) {
        Request.update({date: getDateTime()}, {$inc: payload}, (err) => {

        });
      }

      // Download or output file
      if (dl) {
        res.download(name, "download." + ext, err => {
          fs.unlink(name);
        });
      } else {
        // Hacky PS extension formatting
        if (req.query.extension === "true") {
          output = JSON.parse(output);
          var extObj = {
            results: [{
              user: {
                picture: output.results[0].picture.large.replace('/api', '').replace('https', 'http'),
                name: {
                  first: output.results[0].name.first,
                  last: output.results[0].name.last
                }
              }
            }]
          };
          res.send(extObj);
        } else {
          res.send(output);
        }
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
