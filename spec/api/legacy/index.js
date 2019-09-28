const expect   = require('chai').expect;
const request  = require('supertest');
const settings = require('../../../settings');

// No test coverage for 0.7 & 0.8 (php versions)
const versions = [
  "0.1", "0.2", "0.2.1", "0.3",
  "0.3.1", "0.3.2", "0.4", "0.4.1",
  "0.5", "0.6",
];
module.exports = (server) => {
  versions.forEach((version) => {
    describe(version, () => {
      suite(version);
    });
  });

  // For legacy versions, just make sure routes are accessible with provided RandomAPI hashes in routes/api
  function suite(version) {
    it(`should return 200 when visiting api route (/api/${version})`, async () => {
      const res = await request(server).get(`/api/${version}`)
      expect(res.status).to.equal(200);
    });

    it(`should return correct versioned response when visiting api route (/api/${version})`, async () => {
      const res = await request(server).get(`/api/${version}`)
      const result = JSON.parse(res.text);
      expect(versions.slice(-3).indexOf(version) !== -1 ? result.results[0].user.version : result.results[0].version).to.equal(version);
    });

    it(`should return the same user object when given the same seed`, async () => {
      // First request to get the initial seed
      const req1 = await request(server).get(`/api/${version}`);
      const req1Obj = JSON.parse(req1.text);
      const seed = req1Obj.results[0].seed;
      
      // Make another request using seed and make sure JSON objects are the same
      const req2 = await request(server).get(`/api/${version}?seed=${seed}`);
  
      expect(req1.text).to.equal(req2.text);    
    });
  }
};