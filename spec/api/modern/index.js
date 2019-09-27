const expect   = require('chai').expect;
const request  = require('supertest');
const settings = require('../../../settings');

// No test coverage for 0.7 & 0.8 (php versions)
const versions = [
  "1.0", "1.1", "1.2", "1.3",
];
module.exports = (server) => {
  versions.forEach((version) => {
    describe(version, () => {
      suite(version);
    });
  });

  function suite(version) {
    it(`should return 200 when visiting api route (/api/${version})`, async () => {
      const res = await request(server).get(`/api/${version}`)
      expect(res.status).to.equal(200);
    });

    it(`should return correct versioned response when visiting api route (/api/${version})`, async () => {
      const res = await request(server).get(`/api/${version}`)
      const result = JSON.parse(res.text);
      expect(result.info.version).to.equal(version);
    });

    it(`should return the same user object when given the same seed`, async () => {
      // First request to get the initial seed
      const req1 = await request(server).get(`/api/${version}`);
      const req1Obj = JSON.parse(req1.text);
      const seed = req1Obj.info.seed;
      
      // Make another request using seed and make sure JSON objects are the same
      const req2 = await request(server).get(`/api/${version}?seed=${seed}`);
  
      expect(req1.text).to.equal(req2.text);    
    });

    it(`should return the same user object when given the same seed and on a different page`, async () => {
      let page = Math.floor(Math.random() * 100) + 10;
      // First request to get the initial seed
      const req1 = await request(server).get(`/api/${version}?page=${page}`);
      const req1Obj = JSON.parse(req1.text);
      const seed = req1Obj.info.seed;
      
      // Make another request using seed and make sure JSON objects are the same
      const req2 = await request(server).get(`/api/${version}?page=${page}&seed=${seed}`);
  
      expect(req1.text).to.equal(req2.text);    
    });

    it(`should download random user data when dl parameter is provided`, async () => {
      const res = await request(server).get(`/api/${version}?dl`)
      expect(res.header['content-type']).to.equal("application/octet-stream");
    });
  }
};