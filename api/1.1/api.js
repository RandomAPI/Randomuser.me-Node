/*
  • Fixed HETU for FI
  • Fixed salt not being used in calculation for hashes (also hotfixed 1.0)
  • DOB and Registered use ISO 8601 time standards
  • DOB and Registered can't overlap in impossible ways
  • Added customizable password options
*/

const mersenne     = require('mersenne');
const moment       = require('moment');
const crypto       = require('crypto');
const YAML         = require('yamljs');
const js2xmlparser = require('js2xmlparser');
const converter    = require('json-2-csv');
const version      = '1.1';

// Load the datasets if not defined
if (typeof datasets[version] === 'undefined') {
  require('./loadDatasets')((data, injectNats) => {
    datasets[version] = data;
    injects[version]  = injectNats;
  });
}

const originalFieldList = 'gender, name, location, email,\
login, registered, dob, phone, cell, id, picture, nat';

const originalFieldArray = originalFieldList
                        .split(',')
                        .filter((i) => i !== '')
                        .map((w) => w.trim().toLowerCase());

var Generator = function(options) {
  // Check for multiple vals
  this.checkOptions(options);

  options       = options || {};
  this.results  = Number(options.results);
  this.seed     = options.seed || '';
  this.lego     = typeof options.lego !== 'undefined' && options.lego !== 'false' ? true : false;
  this.gender   = options.gender || null;
  this.format   = (options.format || options.fmt || 'json').toLowerCase();
  this.nat      = options.nat || options.nationality || null;
  this.noInfo   = typeof options.noinfo !== 'undefined' && options.lego !== 'false' ? true : false;
  this.page     = Number(options.page) || 1;
  this.password = options.password;

  // Include all fields by default
  this.inc     = options.inc || originalFieldList;
  this.exc     = options.exc || '';

  this.inc = this.inc.split(',').filter((i) => i !== '').map((w) => w.trim().toLowerCase());
  this.exc = this.exc.split(',').filter((i) => i !== '').map((w) => w.trim().toLowerCase());

  // Remove exclusions
  this.inc = this.inc.filter((w) => this.exc.indexOf(w) === -1);

  // Update exclusions list to inverse of inclusions
  this.exc = originalFieldArray.filter((w) => this.inc.indexOf(w) === -1);

  if (this.nat !== null) {
    this.nat = this.nat.split(',').filter((i) => i !== '');
  }

  if (this.nat !== null) this.nat = uppercaseify(this.nat);
  this.nats    = this.getNats(); // Returns array of nats
  this.constantTime = 1471295130;
  this.version = version;

  // Sanitize values
  if (isNaN(this.results) || this.results < 0 || this.results > settings.maxResults || this.results === '') this.results = 1;

  if (this.gender !== 'male' && this.gender !== 'female' || this.seed !== '') {
    this.gender = null;
  }

  if (this.lego) this.nat = 'LEGO';
  else if (this.nat !== null && !(this.validNat(this.nat))) this.nat = null;

  if (this.seed.length === 18) {
    this.nat = this.nats[parseInt(this.seed.slice(-2), 16)];
  } else if (this.seed === '') {
    this.defaultSeed();
  }

  if (this.page < 0 || this.page > 10000) this.page = 1;
  ///////////////////

  this.seedRNG();
};

Generator.prototype.generate = function(cb) {
  this.results = this.results || 1;

  let output = [];
  let nat, inject;

  for (let i = 0; i < this.results; i++) {
    current = {};
    nat = this.nat === null ? this.randomNat() : this.nat;
    if (Array.isArray(nat)) {
      nat = nat[range(0, nat.length-1)];
    }
    inject = injects[version][nat];

    current.gender = this.gender === null ? randomItem(['male', 'female']) : this.gender;

    let name = this.randomName(current.gender, nat);
    this.include('name', {
      title: current.gender === 'male' ? 'mr' : randomItem(datasets[version].common.title),
      first: name[0],
      last: name[1]
    });

    this.include('location', {
      street: range(1000, 9999) + ' ' + randomItem(datasets[version][nat].street),
      city: randomItem(datasets[version][nat].cities),
      state: randomItem(datasets[version][nat].states),
      postcode: range(10000, 99999)
    });

    this.include('email', name[0] + '.' + name[1].replace(/ /g, '') + '@example.com');

    let salt = random(2, 8);
    let password = this.password === undefined ? randomItem(datasets[version].common.passwords) : this.genPassword();
    this.include('login', {
      username: randomItem(datasets[version].common.user1) + randomItem(datasets[version].common.user2) + range(100, 999),
      password,
      salt:     salt,
      md5:      crypto.createHash('md5').update(password + salt).digest('hex'),
      sha1:     crypto.createHash('sha1').update(password + salt).digest('hex'),
      sha256:   crypto.createHash('sha256').update(password + salt).digest('hex')
    });

    let dob = range(-800000000000, this.constantTime*1000 - 86400000*365*21);
    this.include('dob', moment(dob).format('YYYY-MM-DD HH:mm:ss'));
    this.include('registered', moment(range(1016688461000, this.constantTime*1000)).format('YYYY-MM-DD HH:mm:ss'));

    let id, genderText
    if (nat != 'LEGO') {
        id = current.gender == 'male' ? range(0, 99) : range(0, 96);
        genderText = current.gender == 'male' ? 'men' : 'women';
    } else {
        id = range(0, 9);
        genderText = 'lego';
    }
    base = 'https://randomuser.me/api/';

    this.include('picture', {
      large: base + 'portraits/' + genderText + '/' + id + '.jpg',
      medium: base + 'portraits/med/' + genderText + '/' + id + '.jpg',
      thumbnail: base + 'portraits/thumb/' + genderText + '/' + id + '.jpg'
    });

    inject(this.inc, current);  // Inject unique fields for nationality

    this.include('nat', nat);

    // Gender hack - Remove gender if the user doesn't want it in the results
    if (this.inc.indexOf('gender') === -1) {
      delete current.gender;
    }

    output.push(current);
  }

  let json = {
    results: output,
    info: {
      seed: String(this.seed + (this.nat !== null && !Array.isArray(this.nat) ? pad((this.nats.indexOf(this.nat)).toString(16), 2) : '')),
      results: this.results,
      page: this.page,
      version: this.version
    }
  };

  if (this.noInfo) delete json.info;

  this.defaultSeed();
  this.seedRNG();

  if (this.format === 'yaml') {
    cb(YAML.stringify(json, 4), "yaml");
  } else if (this.format === 'xml') {
    cb(js2xmlparser('user', json), "xml");
  } else if (this.format === 'prettyjson' || this.format === 'pretty') {
    cb(JSON.stringify(json, null, 2), "json");
  } else if (this.format === 'csv') {
    converter.json2csv(json.results, (err, csv) => {
      cb(csv, "csv");
    });
  } else {
    cb(JSON.stringify(json), "json");
  }
};


Generator.prototype.seedRNG = function() {
  let seed = this.seed;
  if (this.seed.length === 18) {
      seed = this.seed.substring(0, 16);
  }
  seed = this.page !== 1 ? seed + String(this.page) : seed;

  seed = parseInt(crypto.createHash('md5').update(seed).digest('hex').substring(0, 8), 16);
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
    for (let i = 0; i < nat.length; i++) {
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
  gender = gender === undefined ? randomItem(['male', 'female']) : gender;
  return [randomItem(datasets[version][nat][gender + '_first']), randomItem(datasets[version][nat]['last'])];
};

Generator.prototype.getNats = function() {
  let exclude = ['common', 'LEGO'];
  let nats = Object.keys(datasets[version]).filter((nat) => {
    return exclude.indexOf(nat) == -1;
  });
  return nats;
};

Generator.prototype.include = function(field, value) {
  if (this.inc.indexOf(field) !== -1) {
    current[field] = value;
  }
};

Generator.prototype.checkOptions = function(options) {
  let keys = Object.keys(options);
  for (let i = 0; i < keys.length; i++) {
    if (Array.isArray(options[keys[i]])) {
      options[keys[i]] = options[keys[i]][options[keys[i]].length-1];
    }
  }
};

Generator.prototype.genPassword = function() {
  if (this.password.length === 0) {
    return randomItem(datasets[version].common.passwords);
  }

  let charsets = {
    special: " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    number: "0123456789"
  };

  // Parse sections
  let sections = ["special", "upper", "lower", "number"];
  let matches = this.password.split(',').filter(val => sections.indexOf(val) !== -1)

  if (matches.length === 0) {
    return randomItem(datasets[version].common.passwords);
  }

  matches = matches.filter((v,i,self) => self.indexOf(v) === i);

  // Construct charset to choose from
  let charset = "";
  matches.forEach(match => {
    charset += charsets[match];
  });

  let length = this.password.split(',').slice(-1)[0];

  // Range
  let min, max;
  if (length.indexOf('-') !== -1) {
    let range = length.split('-').map(Number);
    min = Math.min(...range);
    max = Math.max(...range);
  } else {
    min = Number(Number(length));
    max = min;
  }
  min = min > 64 || min < 1 || min === undefined || isNaN(min) ? 8 : min;
  max = max > 64 || max < 1 || max === undefined || isNaN(max) ? 64 : max;

  let passLen = range(min, max);

  // Generate password
  let password = "";
  for (let i = 0; i < passLen; i++) {
    password += String(charset[range(0, charset.length-1)]);
  }

  return password;
};

let random = (mode, length) => {
  let result = '';
  let chars;

  if (mode == 1) {
      chars = 'abcdef1234567890';
  } else if (mode == 2) {
      chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  } else if (mode == 3) {
      chars = '0123456789';
  } else if (mode == 4) {
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  for (let i = 0; i < length; i++) {
      result += chars[range(0, chars.length-1)];
  }

  return result;
};

let randomItem = (arr) => {
  return arr[range(0, arr.length-1)];
};

let pad = (n, width, z) => {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

let range = (min, max) => {
  return min + mersenne.rand(max-min+1);
};

let uppercaseify = (val) => {
  if (Array.isArray(val)) {
    return val.map((str) => {
      return str.toUpperCase();
    });
  } else {
    return val.toUpperCase();
  }
}

let include = (inc, field, value) => {
  if (inc.indexOf(field) !== -1) {
    if (typeof value === 'function') value();
    else current[field] = value;
  }
};

module.exports = Generator;
