const expect   = require('chai').expect;
const request  = require('supertest');
const settings = require('../../settings');

module.exports = (server) => {
  it('should return 200 when visiting api route', async () => {
    const res = await request(server).get('/api')
    expect(res.status).to.equal(200);
  });

  it('should use latest version when hitting default api route', async () => {
    const res = await request(server).get('/api')
    const result = JSON.parse(res.text);
    expect(result.info.version).to.equal(settings.latestVersion);
  });

  it('should default to 1 instead of accepting floating point results values', async () => {
    const res = await request(server).get(`/api/?results=${Math.random() * 25 + 5}`);
    const result = JSON.parse(res.text);
    expect(result.info.results).to.equal(1);
  });
}