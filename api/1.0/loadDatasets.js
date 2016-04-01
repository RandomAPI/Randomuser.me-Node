var fs   = require('fs');
var _    = require('lodash');
var path = require('path');

// Read in all the nat data
var loadNats = (cb, injects) => {
  var data = {};
  var injects = {};
  fs.readdir(__dirname + '/data', (err, nats) => {
    for (var i = 0; i < nats.length; i++) {
      ((i) => {

        var nat = nats[i];
        data[nat] = {}; // Set up empty object for nat
        if (nat !== 'common') {
          injects[nat] = require(__dirname + '/data/' + nat + '/inject');
        }

        fs.readdir(__dirname + '/data/' + nat + '/lists', (err, lists) => {
          if (err) throw err;
          for (var j = 0; j < lists.length; j++) {

            ((j) => {
              var list = lists[j];
              fs.readFile(__dirname + '/data/' + nat + '/lists/' + list, 'utf-8', (err, contents) => {
                if (err) throw err;
                data[nat][path.basename(list, '.txt')] = contents.split('\n').slice(0, -1);
                if (i === nats.length-1 && j === lists.length-1) {
                  cb(data, injects);
                }
              });
            })(j);

          }
        });

      })(i);

    }
  });
};

module.exports = cb => {
  loadNats((data, injects) => {
    cb(data, injects);
  });
};