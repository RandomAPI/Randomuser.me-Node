const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    var pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', '0' + range(1, 7) + '1-' + random(3, 3) + '-' + random(3, 4));
    include(inc, contents, 'cell', '081-' + random(3, 3) + '-' + random(3, 4));
    include(inc, contents, 'id', {
        name: 'PPS',
        value: random(3, 7) + 'T' + (contents.dob >= 1356998400 ? 'A' : '')
    });
    include(inc, contents, 'picture', pic);
};