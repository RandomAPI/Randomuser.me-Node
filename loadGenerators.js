const fs      = require('fs');
const util    = require('util');
const readdir = util.promisify(fs.readdir);
const async   = require('async');
const store   = require('./store');

module.exports = async () => {
  return new Promise(async (resolve, reject) => {
    let generators = {};
    
    // Scan api folder for available versions
    let versions = (await readdir('./api'))
      .filter((dir) => {
        return ['.DS_Store', '.nextRelease'].indexOf(dir) === -1;
      });
    
    for (let i = 0; i < versions.length; i++) {
      let version = versions[i];
      generators[version] = new (require('./api/' + version + '/api').Generator)();

      // Load in datasets and inject scripts
      await generators[version].init();
    }

    store.set('generators', generators);
    let gKeys = Object.keys(generators);
    console.log("Loaded " + gKeys.length + " generator" + (gKeys.length == 1 ? "" : "s") + ".");
    gKeys.forEach(key => {
      let nats = "", count = 0;
      generators[key].nats.forEach((dkey) => {
        nats += dkey + " ";
        count++;
      });
      console.log("• v" + key + " [" + count + "]: " + nats);
    });

    console.log("");
    resolve();

  });
};