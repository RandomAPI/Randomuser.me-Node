const expect   = require('chai').expect;
const request  = require('supertest');
const settings = require('../../../settings');
const defVersion = "1.1";

module.exports = (server, version=defVersion) => {

  // DoB and registration overlap
  describe(`DoB and registration overlap`, () => {
    it(`DoB should be before registration dates`, async () => {
      const res = await request(server).get(`/api/${version}?results=5000`);
      const result = JSON.parse(res.text);

      expect(result.results.every(i => {
        if (version === "1.0" || version === "1.1") {
          return new Date(i.dob) < new Date(i.registered);
        } else {
          return new Date(i.dob.date) < new Date(i.registered.date);
        }
      })).to.equal(true);
    });
  });

  // Password features
  describe(`Password features`, () => {
    const charSets = {
      special: new Set(`!"#$%&'()*+,- ./:;<=>?@[\\]^_\`{|}~`),
      upper: new Set(`ABCDEFGHIJKLMNOPQRSTUVWXYZ`),
      lower: new Set(`abcdefghijklmnopqrstuvwxyz`),
      number: new Set(`0123456789`),
    };

    Object.keys(charSets).forEach(set => {
      it(`should support ${set} charset`, async () => {
        const res = await request(server).get(`/api/${version}?password=${set}&results=50`);
        const result = JSON.parse(res.text);
  
        expect(result.results.every(i => {
          return i.login.password.split('').every(c => {
            return charSets[set].has(c);
          });
        })).to.equal(true);
      });
    });

    for (let i = 0; i < 5; i++) {
      let min = Math.floor(Math.random() * 15) + 1;
      let max = min + Math.floor(Math.random() * 20);
    
      it(`should support passwords using all charsets with range ${min} to ${max} [check ${i+1} of 5]`, async () => {
        const res = await request(server).get(`/api/${version}?password=special,upper,lower,number,${min}-${max}&results=50`);
        const result = JSON.parse(res.text);
    
        expect(result.results.every(i => {
          return i.login.password.length >= min && i.login.password.length <= max;
        })).to.equal(true);
      });
    }
  });

  // 1.1 should support all previous version features as well
  describe(`Checking support of previous version features`, () => {
    describe('1.0', require('./1.0').bind(this, server, version));
  });

};