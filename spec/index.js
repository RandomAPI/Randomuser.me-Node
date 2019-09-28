const fs      = require('fs');
const async   = require('async');
const expect  = require('chai').expect;
const request = require('supertest');
const parse   = require('csv-parse');
const server  = require('../app').server;
const Request = require('../models/Request');

const website = require('./website');
const api     = require('./api');
const legacy  = require('./api/legacy');
const modern  = require('./api/modern');
const v10  = require('./api/modern/1.0');
const v11  = require('./api/modern/1.1');
const v12  = require('./api/modern/1.2');
const v13  = require('./api/modern/1.3');

// Start up server
before(function(done) {
  this.timeout(10000);
  server.on("serverStarted", () => {
    done();
  });
});

describe('Randomuser.me', function() {
  this.timeout(10000);

  describe('Website', website.bind(this, server));
  
  describe('API', () => {
    describe('General', api.bind(this, server));
    describe.skip('Legacy versions <1.0', legacy.bind(this, server));

    describe('Modern versions >=1.0', () => {
      describe('General', modern.bind(this, server))
      describe('1.0', v10.bind(this, server));
      describe('1.1', v11.bind(this, server));
      describe('1.2', v12.bind(this, server));
      describe('1.3', v13.bind(this, server));
    });
  });

  after((done) => {
    done();
  });
});
