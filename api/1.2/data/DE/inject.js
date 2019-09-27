const {random, randomItem, pad, range, uppercaseify, include} = require('../../api');

module.exports = (inc, contents) => {
    var pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', '0' + random(3, 3) + '-' + random(3, 7));
    include(inc, contents, 'cell', '017' + random(3, 1) + '-' + random(3, 7));
    include(inc, contents, 'id', {
        name: '',
        value: null
    });
    include(inc, contents, 'location', () => {
        var oldStreet = contents.location.street.replace(/(\d+) /, '');
        contents.location.street = oldStreet + ' ' + range(1, 200);
    });
    include(inc, contents, 'picture', pic);
};