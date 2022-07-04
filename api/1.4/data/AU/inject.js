const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', '0' + range(0, 9) + '-' + range(0, 9) + random(3, 3) + '-' + random(3, 4));
    include(inc, contents, 'cell', '04' + random(3, 2) + '-' + random(3, 3) + '-' + random(3, 3));
    include(inc, contents, 'id', {
        name: 'TFN',
        value: random(3, 9)
    });
    include(inc, contents, 'picture', pic);
    include(inc, contents, 'location', () => {
        contents.location.postcode = range(200, 9999); // Override common postcode with AU range
    });
};