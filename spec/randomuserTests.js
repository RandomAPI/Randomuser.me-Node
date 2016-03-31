var expect  = require('chai').expect;
var request = require('supertest');
var server  = require('../app').server;
var app     = require('../app').app;

var Request = require('../models/Request');

describe('Randomuser.me', function() {

  // Start up Express server
  before(function(done) {
    require('../api/loadDatasets')(function(data) {
      Generator = require('../api/api');
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

    it('should return 1 user when visiting api route with no parameters (/api)', function(done) {
      request(server).get('/api').expect(200)
      .end(function (err, res) {
        var result = JSON.parse(res.text);
        expect(result.info.results).to.equal(1);
        done();
      });
    });

    describe('Nationality parameter testing - normal', function() {
      it('should return 1 user from US when visiting api route with nat parameter set to US (/api?nat=US)', function(done) {
        request(server).get('/api?nat=US').expect(200)
        .end(function (err, res) {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.equal("US");
          done();
        });
      });

      it('should return 1 user from US when visiting api route with nationality parameter set to US (/api?nationality=US)', function(done) {
        request(server).get('/api?nationality=US').expect(200)
        .end(function (err, res) {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.equal("US");
          done();
        });
      });

      it('should return 1 user from US when visiting api route with nationality parameter set to US (/api?nationality=US)', function(done) {
        request(server).get('/api?nationality=US').expect(200)
        .end(function (err, res) {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.equal("US");
          done();
        });
      });
    });

    describe('Nationality parameter testing - lowercase', function() {
      it('should return 1 user from US when visiting api route with nat parameter set to us (/api?nat=us)', function(done) {
        request(server).get('/api?nat=us').expect(200)
        .end(function (err, res) {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.equal("US");
          done();
        });
      });

      it('should return 1 user from US when visiting api route with nationality parameter set to us (/api?nationality=us)', function(done) {
        request(server).get('/api?nationality=us').expect(200)
        .end(function (err, res) {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.equal("US");
          done();
        });
      });
    });

    describe('Results parameter testing', function() {
      it('should return 2 users when visiting api route with results parameter set to 2 (/api?results=2)', function(done) {
        request(server).get('/api?results=2').expect(200)
        .end(function (err, res) {
          var result = JSON.parse(res.text);
          expect(result.info.results).to.equal(2);
          done();
        });
      });

      it('should return 1 user when visiting api route with results parameter set to nothing (/api?results=)', function(done) {
        request(server).get('/api?results=').expect(200)
        .end(function (err, res) {
          var result = JSON.parse(res.text);
          expect(result.info.results).to.equal(1);
          done();
        });
      });

      it('should return 1 user when visiting api route with results parameter set to letters (/api?results=asdf)', function(done) {
        request(server).get('/api?results=asdf').expect(200)
        .end(function (err, res) {
          var result = JSON.parse(res.text);
          expect(result.info.results).to.equal(1);
          done();
        });
      });

      it('should return 1 user when visiting api route with results parameter set to negative number (/api?results=-1)', function(done) {
        request(server).get('/api?results=-1').expect(200)
        .end(function (err, res) {
          var result = JSON.parse(res.text);
          expect(result.info.results).to.equal(1);
          done();
        });
      });

      it('should return 1 user when visiting api route with results parameter set to excessive number (/api?results=10000)', function(done) {
        request(server).get('/api?results=10000').expect(200)
        .end(function (err, res) {
          var result = JSON.parse(res.text);
          expect(result.info.results).to.equal(1);
          done();
        });
      });
    });

    describe('Lego parameter testing', function() {
      it('should return 1 lego user when visiting api route with lego parameter set (/api?lego)', function(done) {
        request(server).get('/api?lego').expect(200)
        .end(function (err, res) {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.equal("LEGO");
          done();
        });
      });

      it('should return 1 lego user when visiting api route with lego parameter set to true (/api?lego=true)', function(done) {
        request(server).get('/api?lego=true').expect(200)
        .end(function (err, res) {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.equal("LEGO");
          done();
        });
      });

      it('should NOT return 1 lego user when visiting api route with lego parameter set to false (/api?lego=false)', function(done) {
        request(server).get('/api?lego=false').expect(200)
        .end(function (err, res) {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.not.equal("LEGO");
          done();
        });
      });
    });

    describe('Seed parameter testing', function() {
      it('should return same user when using same seed (random)', function(done) {
        request(server).get('/api').expect(200)
        .end(function (err, res) {
          var result = res.text;

          // Get the seed
          var seed = JSON.parse(res.text).info.seed;

          // Send 2nd request using same seed
          request(server).get('/api/?seed=' + seed).expect(200)
          .end(function (err, res) {
            var result2 = res.text;

            expect(result).to.equal(result2);
            done();
          });
        });
      });

      it('should return same user when using same seed (provided)', function(done) {
        request(server).get('/api/?seed=abcd').expect(200)
        .end(function (err, res) {
          var result = res.text;

          // Send 2nd request using same seed
          request(server).get('/api/?seed=abcd').expect(200)
          .end(function (err, res) {
            var result2 = res.text;

            expect(result).to.equal(result2);
            done();
          });
        });
      });
    });
  });
});
