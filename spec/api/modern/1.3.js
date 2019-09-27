const expect   = require('chai').expect;
const request  = require('supertest');
const settings = require('../../../settings');
const defVersion = "1.3";

module.exports = (server, version=defVersion) => {

  // 1.3 should support all previous version features as well
  describe(`Checking support of previous version features`, () => {
    describe('1.2', require('./1.2').bind(this, server, version));
  });

};