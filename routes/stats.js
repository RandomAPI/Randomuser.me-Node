var fs       = require('fs');
var os       = require('os');
var express  = require('express');
var async    = require('async');
var format   = require('format-number')();
var filesize = require('filesize');
var router   = express.Router();
var Request  = require('../models/Request');

router.get('/', (req, res, next) => {
  async.parallel([
      function(cb){
        Request.findOne({date: getDateTime()}, (err, obj) => {
          if (obj !== null) {
            cb(err, {total: format(obj.total), bandwidth: filesize(obj.bandwidth)});
          } else {
            cb(err, {total: 0, bandwidth: filesize(0)});
          }
        });
      },
      function(cb){
        Request.aggregate([
            {"$group": {
              "_id": 'total',
              "total": { $sum: "$total" },
              "bandwidth": { $sum: "$bandwidth" }
            }},
            { "$sort": {
                "total": -1
            }}
        ],function(err, result) {
          if (result.length !== 0) {
            cb(err, {total: format(result[0].total), bandwidth: filesize(result[0].bandwidth)});
          } else {
            cb(err, {total: 0, bandwidth: filesize(0)});
          }
        });
      },
      function(cb){
        Request.aggregate([
            {"$group": {
              "_id": 'total',
              "total": { $sum: "$total" },
              "bandwidth": { $sum: "$bandwidth" }
            }},
            { "$sort": {
                "total": -1
            }},
            { "$limit": 30 }
        ],function(err, result) {
          if (result.length !== 0) {
            cb(err, {total: format(Math.round(result[0].total/30)), bandwidth: filesize(result[0].bandwidth)});
          } else {
            cb(err, {total: 0, bandwidth: filesize(0)});
          }
        });
      }
  ],
  // optional callback
  function(err, results){
      res.send({
        today: results[0],
        all: results[1],
        30: results[2],
        load: Math.round(os.loadavg()[0]*100) + "%"
      });
  });
});

router.get('/charts', (req, res, next) => {
  Request.find({date: { $gte: getDateTime(30)}}, {date: 1, bandwidth: 1, total: 1, _id: 0}, (err, obj) => {
    res.send(obj.map(row => { return {date: simpleDate(row.date), total: row.total, bandwidth: row.bandwidth}}));
  });
});

function getDateTime(daysBack) {
  daysBack = daysBack || 0;
  var date = new Date(new Date().getTime()-86400000*daysBack)

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? '0' : '') + month;

  var day  = date.getDate();
  day = (day < 10 ? '0' : '') + day;

  return year + '-' + pad(month, 2) + '-' + pad(day, 2);

  function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
}

function simpleDate(date) {
  var a = new Date(date);
  return pad(a.getMonth(), 2) + "." + pad(a.getDate(), 2);
}

module.exports = router;
