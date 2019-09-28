const expect   = require('chai').expect;
const request  = require('supertest');
const parse    = require('csv-parse');
const settings = require('../../../settings');
const defVersion = "1.0";

module.exports = (server, version=defVersion) => {

  const fields = ['gender', 'name', 'location', 'email',
    'login', 'registered', 'dob', 'phone',
    'cell', 'id', 'picture', 'nat'
  ];
  
  let nats = [
    'AU', 'BR', 'CA', 'CH',
    'DE', 'DK', 'ES', 'FI',
    'FR', 'GB', 'IE', 'IR',
    'NL', 'NZ', 'TR', 'US'
  ];

  // Include NO nat for versions 1.2+
  if (version !== "1.0" && version !== "1.1") {
    nats.push('NO');
  }

  // Include fields
  describe(`Include fields`, () => {
    for (let i = 0; i < 5; i++) {
      let copy = [...fields];
      let chosen = new Array(5).fill().map(i => {
        return copy.splice(Math.floor(Math.random() * copy.length), 1)[0];
      }).sort().join(',');
      
      it(`should return only included fields [check ${i+1} of 5] using fields (${chosen})`, async () => {
        const res = await request(server).get(`/api/${version}?inc=${chosen}`);
        const result = JSON.parse(res.text);
        expect(Object.keys(result.results[0]).sort().join(',')).to.equal(chosen);
      });
    }
  });

  // Exclude fields
  describe(`Exclude fields`, () => {
    for (let i = 0; i < 5; i++) {
      let copy = [...fields];
      let chosen = new Array(5).fill().map(i => {
        return copy.splice(Math.floor(Math.random() * copy.length), 1)[0];
      }).sort().join(',');
      
      it(`should return all fields except excluded fields [check ${i+1} of 5] using fields (${chosen})`, async () => {
        const res = await request(server).get(`/api/${version}?exc=${chosen}`);
        const result = JSON.parse(res.text);
        expect(Object.keys(result.results[0]).sort().join(',')).to.equal(copy.sort().toString(','));
      });
    }
  });

  // Request multiple nats
  describe(`Request multiple nats`, () => {
    for (let i = 0; i < 5; i++) {
      let copy = [...nats];
      let chosen = new Array(3).fill().map(i => {
        return copy.splice(Math.floor(Math.random() * copy.length), 1)[0];
      }).sort().join(',');
      
      it(`should return multiple nats [check ${i+1} of 5] using nats (${chosen})`, async () => {
        const res = await request(server).get(`/api/${version}?nat=${chosen}&results=100`);
        const result = JSON.parse(res.text);
        let resultNats = result.results.reduce((acc,cur) => {
          acc.add(cur.nat)
          return acc;
        }, new Set());
        expect([...resultNats].sort().join(',')).to.equal(chosen);
      });
    }
  });

  // Pretty json
  describe(`Pretty JSON format`, () => {
    it(`should return output in nicely formatted json`, async () => {
      const res = await request(server).get(`/api/${version}?fmt=pretty`);
      expect(res.text.slice(0, 22)).to.equal(`{\n  \"results\": [\n    {`);
    });
  });

  // Fetch limits
  describe(`Fetch Limits`, () => {
    it(`should fetch 5,000 users in 1 request`, async () => {
      const res = await request(server).get(`/api/${version}?results=5000`);
      const result = JSON.parse(res.text);
      expect(result.results.length).to.equal(5000);
    });

    it(`should return 1 request when more than 5,000 users are requested`, async () => {
      const res = await request(server).get(`/api/${version}?results=5001`);
      const result = JSON.parse(res.text);
      expect(result.results.length).to.equal(1);
    });
  });

  describe('Format parameter testing', () => {
    it('should return JSON when JSON format specified', async () => {
      const res = await request(server).get(`/api/?fmt=json`);
      const result = res.text;
      try {
        JSON.parse(result);
      } catch(e) {
        throw e;
      }
    });

    it('should return JSON when prettyjson format specified', async () => {
      const res = await request(server).get(`/api/?fmt=prettyjson`);
      const result = res.text;
      try {
        JSON.parse(result);
      } catch(e) {
        throw e;
      }
    });

    it('should return JSON when pretty format specified', async () => {
      const res = await request(server).get(`/api/?fmt=pretty`);
      const result = res.text;
      try {
        JSON.parse(result);
      } catch(e) {
        throw e;
      }
    });

    it('should return JSON when invalid format specified', async () => {
      const res = await request(server).get(`/api/?fmt=blahblah`);
      const result = res.text;
      try {
        JSON.parse(result);
      } catch(e) {
        throw e;
      }
    });

    it('should return CSV when CSV format specified', async () => {
      const res = await request(server).get(`/api/?fmt=csv`);
      const result = res.text;
      parse(res.text, (err, text) => {
        if (err) throw err;
      });
    });

    it('should return content type text/xml when XML format specified', async () => {
      const res = await request(server).get(`/api/?fmt=xml`);
      expect(res.header['content-type']).to.equal("text/xml; charset=utf-8");
    });

    it('should return content type text/x-yaml when YAML format specified', async () => {
      const res = await request(server).get(`/api/?fmt=yaml`);
      expect(res.header['content-type']).to.equal("text/x-yaml; charset=utf-8");
    });

    it('should return content type text/csv when CSV format specified', async () => {
      const res = await request(server).get(`/api/?fmt=csv`);
      expect(res.header['content-type']).to.equal("text/csv; charset=utf-8");
    });
  });

  // Nat check
  describe(`Nat check`, () => {
    for (let i = 0; i < nats.length; i++) {
      let nat = nats[i];
      it(`should retrieve ${nat} nat when specified`, async () => {
        const res = await request(server).get(`/api/${version}?nat=${nat}`);
        const result = JSON.parse(res.text);
        expect(result.results[0].nat).to.equal(nat);
      });
    }
    
    // Special Lego check
    it(`should retrieve lego nat when lego parameter is specified`, async () => {
      const res = await request(server).get(`/api/${version}?lego`);
      const result = JSON.parse(res.text);
      expect(result.results[0].nat).to.equal('LEGO');
    });

    // Invalid nat check
    it(`should retrieve random nat when invalid nat is specified`, async () => {
      const res = await request(server).get(`/api/${version}?nat=blah`);
      const result = JSON.parse(res.text);
      expect(nats).to.include(result.results[0].nat);
    });
  });
};