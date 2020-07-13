/*
  • Use native js dates instead of moment for ~60% increase in dates calculation
  • Email addresses are now transliterated
  • More street/city names for NL dataset
  • Add country name to location block
  • Capitalized proper nouns
  • Split street into number and name properties
  • Fixed Norwegian id generation bug
  • Fixed Switzerland phone number format
  • Fixed Danish CPR number calculation
*/

const fs           = require('fs');
const readDir      = require('util').promisify(fs.readdir);
const readFile     = require('util').promisify(fs.readFile);
const path         = require('path');
const mersenne     = require('mersenne');
const crypto       = require('crypto');
const YAML         = require('yamljs');
const js2xmlparser = require('js2xmlparser');
const converter    = require('json-2-csv');
const faker        = require('faker');
const tr           = require("transliteration");
const util         = require('../../util');
const settings     = require('../../settings');
const version      = '1.3';

class Generator {
  constructor() {
    this.originalFields = [
      'gender', 'name', 'location', 'email',
      'login', 'registered', 'dob', 'phone',
      'cell', 'id', 'picture', 'nat'
    ];
    this.constantTime = 1569449450;
    this.version = version;

    this.datasets = null;
    this.injects = null;
  }

  // Executes on first generation - loads in nat datasets and inject scripts
  async loadData() {
    return new Promise(async (resolve, reject) => {
      let data = {};
      let injects = {};

      let nats = await readDir(__dirname + '/data');
      for (let i = 0; i < nats.length; i++) {

        let nat = nats[i];
        data[nat] = {};

        if (nat !== 'common') {
          injects[nat] = require(__dirname + '/data/' + nat + '/inject');
        }

        let lists = await readDir(__dirname + '/data/' + nat + '/lists');
        for (let j = 0; j < lists.length; j++) {

          let list = lists[j];
          let contents = await readFile(__dirname + '/data/' + nat + '/lists/' + list, 'utf-8');
          data[nat][path.basename(list, '.txt')] = contents.split('\n').slice(0, -1);

        }
      }
      resolve([data, injects]);

    });
  }

  async init() {
    if (this.datasets === null) {
      [this.datasets, this.injects] = await this.loadData();
      this.nats = this.getNats();
    }
  }

  // Returns random user object
  async generate(options) {
    options = options || {};

    return new Promise((resolve, reject) => {
      // Check for multiple vals
      this.checkOptions(options);
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
      this.inc     = options.inc || this.originalFields.join(', ');
      this.exc     = options.exc || '';

      this.inc = this.inc.split(',').filter((i) => i !== '').map((w) => w.trim().toLowerCase());
      this.exc = this.exc.split(',').filter((i) => i !== '').map((w) => w.trim().toLowerCase());

      // Remove exclusions
      this.inc = this.inc.filter((w) => this.exc.indexOf(w) === -1);

      // Update exclusions list to inverse of inclusions
      this.exc = this.originalFields.filter((w) => this.inc.indexOf(w) === -1);

      if (this.nat !== null) {
        this.nat = this.nat.split(',').filter((i) => i !== '');
      }

      if (this.nat !== null) this.nat = uppercaseify(this.nat);

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
    
      let output = [];
      let nat, inject;
    
      for (let i = 0; i < this.results; i++) {
        this.current = {};
        nat = this.nat === null ? this.randomNat() : this.nat;
        if (Array.isArray(nat)) {
          nat = nat[range(0, nat.length-1)];
        }
        inject = this.injects[nat];
    
        this.current.gender = this.gender === null ? randomItem(['male', 'female']) : this.gender;
    
        let name = this.randomName(this.current.gender, nat);
        this.include('name', {
          title: this.current.gender === 'male' ? 'Mr' : randomItem(this.datasets.common.title),
          first: name[0],
          last: name[1]
        });

        let timezone = JSON.parse(randomItem(this.datasets.common.timezones));
        this.include('location', {
          street: {
            number: range(1, 9999),
            name: randomItem(this.datasets[nat].street)
          },
          city: randomItem(this.datasets[nat].cities),
          state: randomItem(this.datasets[nat].states),
          country: this.fullNatName(nat),
          postcode: range(10000, 99999),
          coordinates: {
            latitude: faker.address.latitude(),
            longitude: faker.address.longitude()
          },
          timezone
        });
    
        this.include('email', tr.transliterate(`${name[0]}.${name[1]}`).replace(/ /g, '').toLowerCase() + '@example.com');
    
        let salt = random(2, 8);
        let password = this.password === undefined ? randomItem(this.datasets.common.passwords) : this.genPassword();
        this.include('login', {
          uuid: faker.random.uuid(),
          username: randomItem(this.datasets.common.user1) + randomItem(this.datasets.common.user2) + range(100, 999),
          password,
          salt:   salt,
          md5:    crypto.createHash('md5').update(password + salt).digest('hex'),
          sha1:   crypto.createHash('sha1').update(password + salt).digest('hex'),
          sha256: crypto.createHash('sha256').update(password + salt).digest('hex')
        });
    
        let dob = range(-800000000000, this.constantTime * 1000 - 86400000 * 365 * 21);
        let dobDate = new Date(dob);

        this.current.dob = {
          date: dobDate.toISOString(),
          age:  new Date().getFullYear() - dobDate.getFullYear()
        };
        let reg = range(1016688461000, this.constantTime * 1000);
        let regDate = new Date(reg);
        this.include('registered', {
          date: regDate.toISOString(),
          age: new Date().getFullYear() - regDate.getFullYear()
        });
    
        let id, genderText;
        if (nat != 'LEGO') {
            id = this.current.gender == 'male' ? range(0, 99) : range(0, 96);
            genderText = this.current.gender == 'male' ? 'men' : 'women';
        } else {
            id = range(0, 9);
            genderText = 'lego';
        }
        let base = 'https://randomuser.me/api/';
    
        this.include('picture', {
          large: base + 'portraits/' + genderText + '/' + id + '.jpg',
          medium: base + 'portraits/med/' + genderText + '/' + id + '.jpg',
          thumbnail: base + 'portraits/thumb/' + genderText + '/' + id + '.jpg'
        });
    
        inject(this.inc, this.current, this.datasets);  // Inject unique fields for nationality
    
        this.include('nat', nat);
    
        // Gender hack - Remove gender if the user doesn't want it in the results
        if (this.inc.indexOf('gender') === -1) {
          delete this.current.gender;
        }

        // DoB hack - DoB is required for id generation in NO dataset
        if (this.inc.indexOf('dob') === -1) {
          delete this.current.dob;
        }
    
        output.push(this.current);
      }
    
      let json = {
        results: output,
        info: {
          seed: String(this.seed + (this.nat !== null && !Array.isArray(this.nat) ? util.pad((this.nats.indexOf(this.nat)).toString(16), 2) : '')),
          results: this.results,
          page: this.page,
          version: this.version
        }
      };
    
      if (this.noInfo) delete json.info;
    
      if (this.format === 'yaml') {
        resolve({output: YAML.stringify(json, 4), ext: "yaml"});
      } else if (this.format === 'xml') {
        resolve({output: js2xmlparser('user', json), ext: "xml"});
      } else if (this.format === 'prettyjson' || this.format === 'pretty') {
        resolve({output: JSON.stringify(json, null, 2), ext: "json"});
      } else if (this.format === 'csv') {
        converter.json2csv(json.results, (err, csv) => {
          resolve({output: csv, ext: "csv"});
        });
      } else {
        resolve({output: JSON.stringify(json), ext: "json"});
      }
    });
  }

  // Seeds Mersenne Twister PRNG
  seedRNG() {
    let seed = this.seed;
    if (this.seed.length === 18) {
      seed = this.seed.substring(0, 16);
    }
    seed = this.page !== 1 ? seed + String(this.page) : seed;
  
    seed = parseInt(crypto.createHash('md5').update(seed).digest('hex').substring(0, 8), 16);
    mersenne.seed(seed);
    faker.seed(seed);
  }
  
  // Choose random seed
  defaultSeed() {
    this.seed = random(1, 16);
  }
  
  // Return random nat to use
  randomNat() {
    return this.nats[range(0, this.nats.length - 1)];
  }
  
  // Make sure nat is available
  validNat(nat) {
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
  }
  
  randomName(gender, nat) {
    gender = gender === undefined ? randomItem(['male', 'female']) : gender;
    return [randomItem(this.datasets[nat][gender + '_first']), randomItem(this.datasets[nat]['last'])];
  }
  
  // Return available nats
  getNats() {
    let exclude = ['common', 'LEGO'];
    let nats = Object.keys(this.datasets).filter(nat => {
      return exclude.indexOf(nat) == -1;
    });
    return nats;
  }
  
  include(field, value) {
    if (this.inc.indexOf(field) !== -1) {
      this.current[field] = value;
    }
  }
  
  checkOptions(options) {
    let keys = Object.keys(options);
    for (let i = 0; i < keys.length; i++) {
      if (Array.isArray(options[keys[i]])) {
        options[keys[i]] = options[keys[i]][options[keys[i]].length-1];
      }
    }
  }

  genPassword() {
    if (this.password.length === 0) {
      return randomItem(this.datasets.common.passwords);
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
      return randomItem(this.datasets.common.passwords);
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
    max = max > 64 || max < 1 || max === undefined || isNaN(max) || max < min ? 64 : max;
  
    let passLen = range(min, max);
  
    // Generate password
    let password = "";
    for (let i = 0; i < passLen; i++) {
      password += String(charset[range(0, charset.length-1)]);
    }
  
    return password;
  }

  fullNatName(nat) {
    let mapping = {
      AU: "Australia",
      BR: "Brazil",
      CA: "Canada",
      CH: "Switzerland",
      DE: "Germany",
      DK: "Denmark",
      ES: "Spain",
      FI: "Finland",
      FR: "France",
      GB: "United Kingdom",
      IE: "Ireland",
      IR: "Iran",
      NL: "Netherlands",
      NO: "Norway",
      NZ: "New Zealand",
      TR: "Turkey",
      US: "United States",
    };
    return mapping[nat];
  }
}

function random(mode, length) {
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
}

function randomItem(arr) {
  return arr[range(0, arr.length-1)];
}

function range (min, max) {
  return min + mersenne.rand(max-min+1);
}

function uppercaseify(val) {
  if (Array.isArray(val)) {
    return val.map(str => {
      return str.toUpperCase();
    });
  } else {
    return val.toUpperCase();
  }
}

function include(inc, contents, field, value) {
  if (inc.indexOf(field) !== -1) {
    if (typeof value === 'function') value();
    else contents[field] = value;
  }
}

module.exports = {
  Generator,
  random,
  randomItem,
  pad: util.pad,
  range,
  uppercaseify,
  include,
};