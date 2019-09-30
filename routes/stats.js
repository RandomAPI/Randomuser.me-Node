const os       = require('os');
const express  = require('express');
const async    = require('async');
const format   = require('format-number')();
const filesize = require('filesize');
const router   = express.Router();
const Request  = require('../models/Request');
const util     = require('../util');

router.get('/', (req, res, next) => {
  Request.find({
    date: { $gte: util.getDateTime(30) }
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

function simpleDate(date) {
  const a = new Date(date);
  return util.pad(a.getMonth()+1, 2) + "." + util.pad(a.getUTCDate(), 2);
}

module.exports = router;