const expect   = require('chai').expect;
const request  = require('supertest');
const settings = require('../../../settings');
const defVersion = "1.4";

module.exports = (server, version=defVersion) => {

  describe(`New nats check`, () => {

    const nats = {
      IN: 'India',
      MX: 'Mexico',
      RS: 'Serbia',
      UA: 'Ukraine'
    };

    Object.entries(nats).forEach(([code, country]) => {
      describe(`${country} check`, () => {
        let nat = code;
        it(`should retrieve ${nat} nat when specified`, async () => {
          const res = await request(server).get(`/api/${version}?nat=${nat}`);
          const result = JSON.parse(res.text);
          expect(result.results[0].nat).to.equal(nat);
        });
      });
    });
  });

  // 1.4 should support all previous version features as well
  describe(`Checking support of previous version features`, () => {
    describe('1.3', require('./1.3').bind(this, server, version));
  });

};