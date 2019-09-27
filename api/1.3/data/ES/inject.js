const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', '9' + random(3, 2) + '-' + random(3, 3) + '-' + random(3, 3));
    include(inc, contents, 'cell', '6' + random(3, 2) + '-' + random(3, 3) + '-' + random(3, 3));
    include(inc, contents, 'id', {
        name: 'DNI',
        value: random(3, 8) + '-' + random(4, 1)
    });
    include(inc, contents, 'picture', pic);
};