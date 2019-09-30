const os       = require('os');
const async    = require('async');
const format   = require('format-number')();
const filesize = require('filesize');
const Request  = require('./models/Request');
const Load     = require('./models/Load');
const store    = require('./store');
const util     = require('./util');

// Cache db stats
let stats = {
  today: 0,
  all: 0,
  30: 0,
  load: "0%",
};

let lastMinCheck = -1;

updateStats();
setInterval(updateStats, 2500);
function updateStats() {
  async.parallel([
    (cb) => {
      Request.findOne({
        date: util.getDateTime()
      }, (err, obj) => {
        if (obj !== null) {
          cb(err, {
            total: format(obj.total),
            bandwidth: filesize(obj.bandwidth)
          });
        } else {
          cb(err, {
            total: 0,
            bandwidth: filesize(0)
          });
        }
      });
    },
    (cb) => {
      Request.aggregate([
          {
            "$group": {
              "_id": 'total',
              "total": { $sum: "$total" },
              "bandwidth": { $sum: "$bandwidth" }
            }
          },
          {
            "$sort": { "total": -1 }
          }
      ], (err, result) => {
        if (result.length !== 0) {
          cb(err, {
            total: format(result[0].total),
            bandwidth: filesize(result[0].bandwidth, {
              round: 4
            })
          });
        } else {
          cb(err, {
            total: 0,
            bandwidth: filesize(0)
          });
        }
      });
    },
    (cb) => {
      Request.aggregate([
          { "$sort": {"date": -1} },
          { "$limit": 30 },
          {
            "$group": {
              "_id": 'total',
              "total": { $sum: "$total" },
              "bandwidth": { $sum: "$bandwidth" }
            }
          }
      ], (err, result) => {
        if (result.length !== 0) {
          cb(err, {
            total: format(Math.round(result[0].total / 30)),
            bandwidth: filesize(result[0].bandwidth)
          });
        } else {
          cb(err, {
            total: 0,
            bandwidth: filesize(0)
          });
        }
      });
    }
  ],
  async (err, results) => {
    stats = {
      today: results[0],
      all: results[1],
      30: results[2],
      load: Math.round(os.loadavg()[0] * 100) + "%"
    };
    store.set('stats', stats);

    let mins = new Date().getMinutes();
    if (mins !== lastMinCheck) {
      lastMinCheck = mins;
      await Load.create({date: Date.now(), load: stats.load.slice(0, -1)});
    }
  });
}

module.exports = (server) => {
  const io = require('socket.io')(server);

  io.on('connection', socket => {
    socket.on('stats', msg => {
      socket.emit('statsResults', stats);
    });
  });
};