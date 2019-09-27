const os       = require('os');
const express  = require('express');
const async    = require('async');
const format   = require('format-number')();
const filesize = require('filesize');
const router   = express.Router();
const Request  = require('../models/Request');

router.get('/', (req, res, next) => {
  Request.find({
    date: { $gte: getDateTime(30) }
  }, {
    date: 1,
    bandwidth: 1,
    total: 1,
    _id: 0
  }, {
    sort: {date: 1}
  }, (err, obj) => {
    res.send(obj.map(row => {
      return {
        date: simpleDate(row.date),
        total: String(row.total).replace(',', ''),
        bandwidth: String(row.bandwidth).replace(',', '')
      }
    }));
  });
});

function getDateTime(daysBack) {
  daysBack = daysBack || 0;
  const date = new Date(new Date().getTime() - 86400000 * daysBack);
  const year = date.getFullYear();

  let month = date.getMonth() + 1;
  month = (month < 10 ? '0' : '') + month;

  let day  = date.getDate();
  day = (day < 10 ? '0' : '') + day;

  return year + '-' + pad(month, 2) + '-' + pad(day, 2);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function simpleDate(date) {
  const a = new Date(date);
  return pad(a.getMonth()+1, 2) + "." + pad(a.getUTCDate(), 2);
}

module.exports = router;