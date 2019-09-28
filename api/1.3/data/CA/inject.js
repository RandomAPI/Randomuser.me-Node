const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', random(3, 3) + '-' + random(3, 3) + '-' + random(3, 4));
    include(inc, contents, 'cell', random(3, 3) + '-' + random(3, 3) + '-' + random(3, 4));
    include(inc, contents, 'id', {
        name: '',
        value: null
    });
    include(inc, contents, 'location', () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const postcodes = letters[range(0,25)] + random(3, 1) + letters[range(0,25)] + ' ' + random(3, 1) + letters[range(0,25)] + random(3, 1);
        contents.location.postcode = postcodes;
    });
    include(inc, contents, 'picture', pic);
};