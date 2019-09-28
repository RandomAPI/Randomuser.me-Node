const expect   = require('chai').expect;
const request  = require('supertest');
const settings = require('../../../settings');
const defVersion = "1.2";

module.exports = (server, version=defVersion) => {

  // Norway check
  describe(`Norway check`, () => {
    let nat = 'NO';
    it(`should retrieve ${nat} nat when specified`, async () => {
      const res = await request(server).get(`/api/${version}?nat=${nat}`);
      const result = JSON.parse(res.text);
      expect(result.results[0].nat).to.equal(nat);
    });
  });

  // 1.2 should support all previous version features as well
  describe(`Checking support of previous version features`, () => {
    describe('1.1', require('./1.1').bind(this, server, version));
  });

};