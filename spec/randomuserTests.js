var fs      = require('fs');
var async   = require('async');
var expect  = require('chai').expect;
var request = require('supertest');
var server  = require('../app').server;
var app     = require('../app').app;

var Request = require('../models/Request');

Generator = {};
datasets  = {};
injects   = {};

describe('Randomuser.me', () => {

  // Start up Express server
  before(done => {
    // Load in all generators and datasets before starting the server
    // Scan api folder for available versions
    var versions = fs.readdirSync('./api').filter(dir => dir !== '.DS_Store');

    async.forEachOf(versions, (value, key, callback) => {
      require('../api/' + value + '/loadDatasets')(data => {
        Generator[value] = require('../api/' + value + '/api');
        datasets[value]  = data;
        callback();
      });
    }, (err, results) => {
        server.listen(app.get('port'));
        server.on('error', error => {
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

  describe('Website', () => {
    it('should return 200 when visiting home page (/)', (done) => {
      request(server).get('/').expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
    });

    it('should return 301 when visiting home page (/index) and redirect to /', (done) => {
      request(server).get('/index')
      .end((err, res) => {
        expect(res.header['location']).to.equal('/');
        done();
      });
    });

    it('should return 200 when visiting photos page (/photos)', (done) => {
      request(server).get('/photos').expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
    });

    it('should return 200 when visiting documentation page (/documentation)', (done) => {
      request(server).get('/documentation').expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
    });

    it('should return 200 when visiting changelog page (/changelog)', (done) => {
      request(server).get('/changelog').expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
    });

    it('should return 200 when visiting stats page (/stats)', (done) => {
      request(server).get('/stats').expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
    });

    it('should return 200 when visiting donate page (/donate)', (done) => {
      request(server).get('/donate').expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
    });

    it('should return 200 when visiting copyright page (/copyright)', (done) => {
      request(server).get('/copyright').expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
    });

    it('should return 200 when visiting photoshop page (/photoshop)', (done) => {
      request(server).get('/photoshop').expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
    });

    it('should return 200 when visiting sketch page (/sketch)', (done) => {
      request(server).get('/sketch').expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
    });
  });

  describe('API', () => {
    it('should return 200 when visiting api route', (done) => {
      request(server).get('/api').expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
    });

    it('should return 1 user when visiting api route with no parameters (/api)', (done) => {
      request(server).get('/api').expect(200)
      .end((err, res) => {
        var result = JSON.parse(res.text);
        expect(result.info.results).to.equal(1);
        done();
      });
    });

    describe('Nationality parameter testing - normal', () => {
      it('should return 1 user from US when visiting api route with nat parameter set to US (/api?nat=US)', (done) => {
        request(server).get('/api?nat=US').expect(200)
        .end((err, res) => {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.equal('US');
          done();
        });
      });

      it('should return 1 user from US when visiting api route with nationality parameter set to US (/api?nationality=US)', (done) => {
        request(server).get('/api?nationality=US').expect(200)
        .end((err, res) => {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.equal('US');
          done();
        });
      });

      it('should return 1 user from US when visiting api route with nationality parameter set to US (/api?nationality=US)', (done) => {
        request(server).get('/api?nationality=US').expect(200)
        .end((err, res) => {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.equal('US');
          done();
        });
      });
    });

    describe('Nationality parameter testing - lowercase', () => {
      it('should return 1 user from US when visiting api route with nat parameter set to us (/api?nat=us)', (done) => {
        request(server).get('/api?nat=us').expect(200)
        .end((err, res) => {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.equal('US');
          done();
        });
      });

      it('should return 1 user from US when visiting api route with nationality parameter set to us (/api?nationality=us)', (done) => {
        request(server).get('/api?nationality=us').expect(200)
        .end((err, res) => {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.equal('US');
          done();
        });
      });
    });

    describe('Results parameter testing', () => {
      it('should return 2 users when visiting api route with results parameter set to 2 (/api?results=2)', (done) => {
        request(server).get('/api?results=2').expect(200)
        .end((err, res) => {
          var result = JSON.parse(res.text);
          expect(result.info.results).to.equal(2);
          done();
        });
      });

      it('should return 1 user when visiting api route with results parameter set to nothing (/api?results=)', (done) => {
        request(server).get('/api?results=').expect(200)
        .end((err, res) => {
          var result = JSON.parse(res.text);
          expect(result.info.results).to.equal(1);
          done();
        });
      });

      it('should return 1 user when visiting api route with results parameter set to letters (/api?results=asdf)', (done) => {
        request(server).get('/api?results=asdf').expect(200)
        .end((err, res) => {
          var result = JSON.parse(res.text);
          expect(result.info.results).to.equal(1);
          done();
        });
      });

      it('should return 1 user when visiting api route with results parameter set to negative number (/api?results=-1)', (done) => {
        request(server).get('/api?results=-1').expect(200)
        .end((err, res) => {
          var result = JSON.parse(res.text);
          expect(result.info.results).to.equal(1);
          done();
        });
      });

      it('should return 1 user when visiting api route with results parameter set to excessive number (/api?results=10000)', (done) => {
        request(server).get('/api?results=10000').expect(200)
        .end((err, res) => {
          var result = JSON.parse(res.text);
          expect(result.info.results).to.equal(1);
          done();
        });
      });
    });

    describe('Lego parameter testing', () => {
      it('should return 1 lego user when visiting api route with lego parameter set (/api?lego)', (done) => {
        request(server).get('/api?lego').expect(200)
        .end((err, res) => {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.equal('LEGO');
          done();
        });
      });

      it('should return 1 lego user when visiting api route with lego parameter set to true (/api?lego=true)', (done) => {
        request(server).get('/api?lego=true').expect(200)
        .end((err, res) => {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.equal('LEGO');
          done();
        });
      });

      it('should NOT return 1 lego user when visiting api route with lego parameter set to false (/api?lego=false)', (done) => {
        request(server).get('/api?lego=false').expect(200)
        .end((err, res) => {
          var result = JSON.parse(res.text);
          expect(result.results[0].info.nat).to.not.equal('LEGO');
          done();
        });
      });
    });

    describe('Seed parameter testing', () => {
      it('should return same user when using same seed (random)', (done) => {
        request(server).get('/api').expect(200)
        .end((err, res) => {
          var result = res.text;

          // Get the seed
          var seed = JSON.parse(res.text).info.seed;

          // Send 2nd request using same seed
          request(server).get('/api/?seed=' + seed).expect(200)
          .end((err, res) => {
            var result2 = res.text;

            expect(result).to.equal(result2);
            done();
          });
        });
      });

      it('should return same user when using same seed (provided)', (done) => {
        request(server).get('/api/?seed=abcd').expect(200)
        .end((err, res) => {
          var result = res.text;

          // Send 2nd request using same seed
          request(server).get('/api/?seed=abcd').expect(200)
          .end((err, res) => {
            var result2 = res.text;

            expect(result).to.equal(result2);
            done();
          });
        });
      });
    });
  });
});
