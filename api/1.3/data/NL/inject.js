const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', () => {
      const phones = [
        '(0' + random(3, 2) + ') ' + random(3, 7),
        '(0' + random(3, 3) + ') ' + random(3, 6)
      ];
      contents.phone = randomItem(phones);
    });
    include(inc, contents, 'cell', '(06) ' + random(3, 8));
    include(inc, contents, 'id', {
        name: 'BSN',
        value: random(3, 8)
    });
    include(inc, contents, 'location', () => {
    const code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    contents.location.postcode = random(3, 4) + ' ' + code[range(0, 25)] + code[range(0, 25)];
    });
    include(inc, contents, 'picture', pic);
};
