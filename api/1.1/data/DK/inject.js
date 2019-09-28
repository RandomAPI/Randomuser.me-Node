const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    var pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', random(3, 8));
    include(inc, contents, 'cell', random(3, 8));
    include(inc, contents, 'id', {
        name: 'CPR',
        value: random(3, 6) + '-' + random(3, 4)
    });
    include(inc, contents, 'picture', pic);
};
