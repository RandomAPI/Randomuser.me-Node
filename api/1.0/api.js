var mersenne = require('mersenne');
var crypto   = require("crypto");
var YAML = require('yamljs');
var js2xmlparser = require("js2xmlparser");
var version = "1.0";

// Load the datasets if not defined
if (typeof datasets[version] === "undefined") {
  require('./loadDatasets')(function(data, injectNats) {
    datasets[version] = data;
    injects[version]  = injectNats;
  });
}

var originalFieldList = "gender, name, location, email, username,\
password, salt, md5, sha1, sha256, registered,\
dob, phone, cell, id, picture, info";

var originalFieldArray = originalFieldList
                        .split(',')
                        .filter((i) => i !== "")
                        .map((w) => w.trim().toLowerCase());

var Generator = function(options) {
  options      = options || {};
  this.results = Number(options.results);
  this.seed    = options.seed || "";
  this.lego    = typeof options.lego !== "undefined" && options.lego !== "false" ? true : false;
  this.gender  = options.gender || null;
  this.format  = options.format || options.fmt || "json";
  this.nat     = options.nat || options.nationality || null;
  this.noInfo  = typeof options.noinfo !== "undefined" && options.lego !== "false" ? true : false;

  // Include all fields by default
  this.inc     = options.inc || originalFieldList;
  this.exc     = options.exc || "";

  this.inc = this.inc.split(',').filter((i) => i !== "").map((w) => w.trim().toLowerCase());
  this.exc = this.exc.split(',').filter((i) => i !== "").map((w) => w.trim().toLowerCase());

  // Remove exclusions
  this.inc = this.inc.filter((w) => this.exc.indexOf(w) === -1);

  // Update exclusions list to inverse of inclusions
  this.exc = originalFieldArray.filter((w) => this.inc.indexOf(w) === -1);

  if (this.nat !== null) {
    this.nat = this.nat.split(',').filter((i) => i !== "");
  }

  if (this.nat !== null) this.nat = uppercaseify(this.nat);
  this.nats    = this.getNats(); // Returns array of nats
  this.constantTime = 1437996378;
  this.version = version;

  // Sanitize values
  if (isNaN(this.results) || this.results < 0 || this.results > 5000 || this.results === "") this.results = 1;

  if (this.gender !== "male" && this.gender !== "female" || this.seed !== null) {
    this.gender = null;
  }

  if (this.lego) this.nat = "LEGO";
  else if (this.nat !== null && !(this.validNat(this.nat))) this.nat = null;

  if (this.seed.length === 18) {
    this.nat = this.nats[parseInt(this.seed.slice(-2), 16)];
  } else if (this.seed === "") {
    this.defaultSeed();
  }
  ///////////////////

  this.seedRNG();
};

Generator.prototype.generate = function(results) {
  this.results = results || this.results || 1;

  var output = [];
  var nat, inject;

  for (var i = 0; i < this.results; i++) {
    current = {};
    nat = this.nat === null ? this.randomNat() : this.nat;
    if (Array.isArray(nat)) {
      nat = nat[range(0, nat.length-1)];
    }
    inject = injects[version][nat];

    this.include("gender", randomItem(["male", "female"]));

    var name = this.randomName(current.gender, nat);
    this.include("name", {
      title: current.gender === "male" ? "mr" : randomItem(datasets[version].common.title),
      first: name[0],
      last: name[1]
    });

    this.include("location", {
      street: range(1000, 9999) + " " + randomItem(datasets[version][nat].street),
      city: randomItem(datasets[version][nat].cities),
      state: randomItem(datasets[version][nat].states),
      postcode: range(10000, 99999)
    });

    this.include("email", name[0] + "." + name[1].replace(' ', '') + "@example.com");
    this.include("username", randomItem(datasets[version].common.user1) + randomItem(datasets[version].common.user2) + range(100, 999));
    this.include("password", randomItem(datasets[version].common.passwords));
    this.include("salt", random(2, 8));

    var salt = current.salt !== undefined ? current.salt : "";
    this.include("md5", crypto.createHash("md5").update(current.password + salt).digest("hex"));
    this.include("sha1", crypto.createHash("sha1").update(current.password + salt).digest("hex"));
    this.include("sha256", crypto.createHash("sha256").update(current.password + salt).digest("hex"));

    this.include("registered", range(915148800, this.constantTime));
    this.include("dob", range(0, this.constantTime));

    if (nat != "LEGO") {
        var id = current.gender == "male" ? range(0, 99) : range(0, 96);
        var genderText = current.gender == "male" ? "men" : "women";
    } else {
        var id = range(0, 9);
        var genderText = "lego";
    }
    base = "https://randomuser.me/api/";

    this.include("picture", {
      large: base + "portraits/" + genderText + "/" + id + ".jpg",
      medium: base + "portraits/med/" + genderText + "/" + id + ".jpg",
      thumbnail: base + "portraits/thumb/" + genderText + "/" + id + ".jpg"
    });

    inject(this.inc, current);  // Inject unique fields for nationality

    this.include("info", {
      nat: nat,
      //seed: String(this.seed + (this.nat !== null ? pad((this.nats.indexOf(this.nat)).toString(16), 2) : "")),
      version: this.version
    });

    output.push(current);
  }

  var json = {
    results: output,
    info: {
      seed: String(this.seed + (this.nat !== null && !Array.isArray(this.nat) ? pad((this.nats.indexOf(this.nat)).toString(16), 2) : "")),
      results: this.results,
      inc: this.inc,
      exc: this.exc,
      version: this.version
    }
  };

  if (this.noInfo) delete json.info;

  this.defaultSeed();
  this.seedRNG();

  if (this.format === "yaml") {
    return YAML.stringify(json, 4);
  } else if (this.format === "xml") {
    return js2xmlparser("user", json);
  } else if (this.format === "prettyjson" || this.format === "pretty") {
    return JSON.stringify(json, null, 2);
  } else {
    return JSON.stringify(json);
  }
};


Generator.prototype.seedRNG = function() {
  var seed = this.seed;
  if (seed.length === 18) {
      seed = seed.substring(0, 16);
  }
  seed = parseInt(crypto.createHash("md5").update(seed).digest("hex").substring(0, 8), 16);
  mersenne.seed(seed);
};

Generator.prototype.defaultSeed = function() {
  this.seed = random(1, 16);
};

Generator.prototype.randomNat = function() {
  return this.nats[range(0, this.nats.length-1)];
};

Generator.prototype.validNat = function(nat) {
  if (Array.isArray(nat)) {
    for (var i = 0; i < nat.length; i++) {
      if (this.nats.indexOf(nat[i]) === -1) {
        return false;
      }
    }
  } else {
    return this.nats.indexOf(nat) !== -1;
  }
  return true;
};

Generator.prototype.randomName = function(gender, nat) {
  gender = gender === undefined ? randomItem(["male", "female"]) : gender;
  return [randomItem(datasets[version][nat][gender + "_first"]), randomItem(datasets[version][nat]["last"])];
};

Generator.prototype.getNats = function() {
  var exclude = ["common", "LEGO"];
  var nats = Object.keys(datasets[version]).filter(function(nat) {
    return exclude.indexOf(nat) == -1;
  });
  return nats;
};

Generator.prototype.include = function(field, value) {
  if (this.inc.indexOf(field) !== -1) {
    current[field] = value;
  }
};

random = function(mode, length) {
  var result = "";
  var chars;

  if (mode == 1) {
      chars = "abcdef1234567890";
  } else if (mode == 2) {
      chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  } else if (mode == 3) {
      chars = "0123456789";
  } else if (mode == 4) {
      chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  for (var i = 0; i < length; i++) {
      result += chars[range(0, chars.length-1)];
  }

  return result;
};

randomItem = function(arr) {
  return arr[range(0, arr.length-1)];
};

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

range = function(min, max) {
  return min + mersenne.rand(max-min+1);
};

function uppercaseify(val) {
  if (Array.isArray(val)) {
    return val.map(function(str) {
      return str.toUpperCase();
    });
  } else {
    return val.toUpperCase();
  }
}

include = function(inc, field, value) {
  if (inc.indexOf(field) !== -1) {
    if (typeof value === 'function') value();
    else current[field] = value;
  }
};

module.exports = Generator;
