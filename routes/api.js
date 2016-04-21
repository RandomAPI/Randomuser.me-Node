var fs      = require('fs');
var express = require('express');
var router  = express.Router();
var cors    = require('cors');
var Request = require('../models/Request');

var latestVersion = '1.0';

router.get('/', cors(), (req, res, next) => {
  genUser(req, res, latestVersion);
});

router.get('/:version', cors(), (req, res, next) => {
  genUser(req, res, req.params.version);
});

function genUser(req, res, version) {
  var ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (clients[ip] >= settings.limit) {
    res.status(503).json({
      error: "Whoa, slow down there. You've requested " + clients[ip] + " users in the last minute. Help us keep this service free and spare some bandwidth for other users please :)"
    });
    return;
  }

  version = version || latestVersion;

  // Version doesn't exist
  if (typeof Generator[version] === 'undefined') {
    res.sendStatus(404);
    return;
  }

  var results = req.query.results || 1;
  if (results > settings.maxResults || results < 1 || isNaN(results)) results = 1;

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

      if (ext === 'json'){
        res.setHeader('Content-Type', 'application/json');
      }else if (ext === 'xml'){
        res.setHeader('Content-Type', 'text/xml');
      }else{
        res.setHeader('Content-Type', 'text/plain');
      }
    }

    var payload = {
      'bandwidth': output.length,
      'total': results
    };
    payload[version.replace('.', '_')] = results;

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
                picture: output.results[0].picture.large.replace('/api', ''),
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
