const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    var pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', '0' + random(3, 2) + '-' + random(3, 8));
    include(inc, contents, 'cell', '09' + random(3, 2) + '-' + random(3, 3) + '-' + random(3, 4));
    include(inc, contents, 'id', {
        name: '',
        value: null
    });
    include(inc, contents, 'picture', pic);
};