const { transliterate } = require('transliteration');
const { random, include, pad, randomItem } = require('../../api');

module.exports = (inc, contents, datasets) => {
  const lastName = contents.gender === 'male' ? randomItem(datasets['PL'].male_last) : randomItem(datasets['PL'].female_last);

  include(inc, contents, 'phone', `+48 ${random(3, 3)} ${random(3, 3)} ${random(3, 3)}`);

  include(inc, contents, 'cell', `+48 ${random(3, 3)} ${random(3, 3)} ${random(3, 3)}`);

  include(inc, contents, 'id', () => {
    const dobDate = new Date(contents.dob.date);
    const generatePesel = () => {
      const pesel = `${dobDate.getFullYear().toString().slice(-2)
        }${pad(dobDate.getMonth() + 1, 2)
        }${pad(dobDate.getDate(), 2)
        }${random(3, 3)
        }${contents.gender === 'male' ? randomItem([1, 3, 5, 7, 9]) : randomItem([0, 2, 4, 6, 8]) // odd number for man, even number for woman
        }`
      const checksum = 10 - ((pesel[0] * 1 + pesel[1] * 3 + pesel[2] * 7 + pesel[3] * 9 + pesel[4] * 1 + pesel[5] * 3 +
        pesel[6] * 7 + pesel[7] * 9 + pesel[8] * 1 + pesel[9] * 3) % 10) % 10;

      return `${pesel}${checksum}`;
    };
    contents.id = {
      name: 'PESEL',
      value: generatePesel()
    }
  });

  include(inc, contents, 'location', () => {
    contents.location.postcode = `${random(3, 2)}-${random(3, 3)}`;
  });

  include(inc, contents, 'name', () => {
    contents.name.title = contents.gender === 'male' ? 'Pan' : 'Pani';
    contents.name.last = lastName;
  });

  include(inc, contents, 'email', () => {
    contents.email = transliterate(`${contents.name.first}.${lastName}`).replace(/ /g, '').toLowerCase() + '@example.com';
  });

};
