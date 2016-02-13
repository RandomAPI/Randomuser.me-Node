var fs   = require('fs');
var _    = require('lodash');
var path = require('path');

// Read in all the nat data
function loadNats(cb) {
  var data = {};
  fs.readdir(__dirname + '/data', function(err, nats) {
    for (var i = 0; i < nats.length; i++) {
      (function(i) {

        var nat = nats[i];
        data[nat] = {}; // Set up empty object for nat

        fs.readdir(__dirname + '/data/' + nat + '/lists', function(err, lists) {
          if (err) throw err;
          for (var j = 0; j < lists.length; j++) {

            (function(j) {
              var list = lists[j];
              fs.readFile(__dirname + '/data/' + nat + '/lists/' + list, 'utf-8', function(err, contents) {
                if (err) throw err;
                data[nat][path.basename(list, ".txt")] = contents;
                if (i === nats.length-1 && j === lists.length-1) {
                  cb(data);
                }
              });
            })(j);

          }
        });

      })(i);

    }
  });
};

module.exports = function(cb) {
  loadNats(function(data) {
    cb(data);
  });
};