const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents, datasets) => {
  const pic = contents.picture;
  delete contents.picture;

  include(inc, contents, 'phone', randomItem([2, 3, 5, 6, 7, 8]) + random(3, 7));
  include(inc, contents, 'cell', randomItem([4, 9]) + random(3, 7));
  include(inc, contents, 'id', () => {
    const dobDate = new Date(contents.dob.date),
        dobISO = dobDate.toISOString(),
        birthDate = dobISO.substr(8, 2) + dobISO.substr(5, 2) + dobISO.substr(2, 2);

    const calculateCheckDigits = (tenDigits) => {
      const checkDigit = (staticSequence, input) => {
        input = input.split('').map(Number);
        let productSum = staticSequence.reduce((acc, value, index) => {
          return acc + value * input[index];
        }, 0);

        const sumMod11 = productSum % 11;
        return (sumMod11 === 0 ? '0' : (11 - sumMod11));
      };
      const staticSequenceFirstCheckDigit = [3, 7, 6, 1, 8, 9, 4, 5, 2];
      const staticSequenceSecondCheckDigit = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

      const k1 = checkDigit(staticSequenceFirstCheckDigit, tenDigits);
      const k2 = checkDigit(staticSequenceSecondCheckDigit, tenDigits + k1);

      return k1 + '' + k2;
    };

    const getPersonId = (birthDate, year, gender) => {
      let no;
      let isMale = (gender === 'male');

      if (year >= 2000) {
        no = 999 - range(0, (999 - 500));
      } else if (year <= 1899) {
        no = 749 - range(0, (749 - 500));
      } else if (year >= 1900 && year <= 1999) {
        no = 499 - range(0, 499);
      }
      if ( ((no & 1) && isMale) || (!(no & 1) && !isMale) ) {
        no--;
      }
      no = pad(String(no), 3);

      const fNr = birthDate + no;
      const fNr11 = fNr + calculateCheckDigits(fNr);

      if (fNr11.length !== 11 || fNr11.substr(-1) === '0') {
        return getPersonId(birthDate, year, gender);
      }
      return fNr11;
    };

    contents.id = {
      name: 'FN',
      value: getPersonId(birthDate, dobDate.getFullYear(), contents.gender),
    };
  });

  include(inc, contents, 'location', () => {
    const version = Object.keys(datasets).reverse()[0];
    const oldStreet = contents.location.street.replace(/(\d+) /, '');
    contents.location.street = oldStreet + ' ' + range(1, 9998);
    contents.location.postcode = randomItem(datasets['NO'].post_codes);
  });
  include(inc, contents, 'picture', pic);
};
