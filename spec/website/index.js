const expect  = require('chai').expect;
const request = require('supertest');

module.exports = (server) => {
  it('should return 200 when visiting home page (/)', async () => {
    const res = await request(server).get('/')
    expect(res.status).to.equal(200);
  });

  it('should return 301 when visiting home page (/index) and redirect to /', async () => {
    const res = await request(server).get('/index')
    expect(res.status).to.equal(301);
    expect(res.header['location']).to.equal('/');
  });

  it('should return 200 when visiting photos page (/photos)', async () => {
    const res = await request(server).get('/photos')
    expect(res.status).to.equal(200);
  });

  it('should return 200 when visiting documentation page (/documentation)', async () => {
    const res = await request(server).get('/documentation')
    expect(res.status).to.equal(200);
  });

  it('should return 200 when visiting changelog page (/changelog)', async () => {
    const res = await request(server).get('/changelog')
    expect(res.status).to.equal(200);
  });

  it('should return 200 when visiting stats page (/stats)', async () => {
    const res = await request(server).get('/stats')
    expect(res.status).to.equal(200);
  });

  it('should return 200 when visiting donate page (/donate)', async () => {
    const res = await request(server).get('/donate')
    expect(res.status).to.equal(200);
  });

  it('should return 200 when visiting copyright page (/copyright)', async () => {
    const res = await request(server).get('/copyright')
    expect(res.status).to.equal(200);
  });

  it('should return 200 when visiting photoshop page (/photoshop)', async () => {
    const res = await request(server).get('/photoshop')
    expect(res.status).to.equal(200);
  });

  it('should return 200 when visiting sketch page (/sketch)', async () => {
    const res = await request(server).get('/sketch')
    expect(res.status).to.equal(200);
  });
  
  it('should return chart into when hitting /getStats endpoint', async () => {
    const res = await request(server).get('/getStats')
    expect(res.status).to.equal(200);
  });

  it('should return 200 when posting to /donate with valid info and valid email', async () => {
    const res = await request(server).post('/donate').send({data: `{"recaptcha": "test", "token": {"email": "testing@gmail.com"}}`});
    expect(res.status).to.equal(200);
  });
}