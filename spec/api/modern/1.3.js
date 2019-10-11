const expect   = require('chai').expect;
const request  = require('supertest');
const settings = require('../../../settings');
const defVersion = "1.3";

module.exports = (server, version=defVersion) => {

  describe(`Email address formatting`, () => {

    // No spaces in email address
    it(`should not include spaces in email address`, async () => {
      const res = await request(server).get(`/api/${version}?results=5000&inc=email`);
      const result = JSON.parse(res.text);

      expect(result.results.every(user => {
        return user.email.indexOf(' ') === -1;
      })).to.equal(true);
    });

    // Email addresses should be lowercase
    it(`should be lowercase`, async () => {
      const res = await request(server).get(`/api/${version}?results=5000&inc=email`);
      const result = JSON.parse(res.text);

      expect(result.results.every(user => {
        return user.email.toLowerCase() === user.email;
      })).to.equal(true);
    });
  });

  // 1.3 should support all previous version features as well
  describe(`Checking support of previous version features`, () => {
    describe('1.2', require('./1.2').bind(this, server, version));
  });

};