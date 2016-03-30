var expect  = require('chai').expect;
var request = require('supertest');
var server  = require('../app').server;
var app      = require('../app').app;

var Request = require('../models/Request');

describe('Randomuser.me', function() {

  // Start up Express server
  before(function(done) {
    require('../api/loadDatasets')(function(data) {
      api = require('../api/api');
      datasets = data;
      server.listen(app.get('port'));
      server.on('error', function(error) {
        var bind = app.get('port');
        switch (error.code) {
          case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
          case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
          default:
            throw error;
        }
      });
      done();
    });
  });

  describe('Website', function() {
    it('should return 200 when visiting home page (/)', function(done) {
      request(server).get('/').expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
    });

    it('should return 301 when visiting home page (/index) and redirect to /', function(done) {
      request(server).get('/index')
      .end(function (err, res) {
        expect(res.header['location']).to.equal('/');
        done();
      });
    });

    it('should return 200 when visiting photos page (/photos)', function(done) {
      request(server).get('/photos').expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
    });

    it('should return 200 when visiting documentation page (/documentation)', function(done) {
      request(server).get('/documentation').expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
    });

    it('should return 200 when visiting changelog page (/changelog)', function(done) {
      request(server).get('/changelog').expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
    });

    it('should return 200 when visiting stats page (/stats)', function(done) {
      request(server).get('/stats').expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
    });

    it('should return 200 when visiting donate page (/donate)', function(done) {
      request(server).get('/donate').expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
    });

    it('should return 200 when visiting copyright page (/copyright)', function(done) {
      request(server).get('/copyright').expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
    });

    it('should return 200 when visiting photoshop page (/photoshop)', function(done) {
      request(server).get('/photoshop').expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
    });

    it('should return 200 when visiting sketch page (/sketch)', function(done) {
      request(server).get('/sketch').expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
    });
  });

  describe('API', function() {
    it('should return 200 when visiting api route', function(done) {
      request(server).get('/api').expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
    });
  });
});
