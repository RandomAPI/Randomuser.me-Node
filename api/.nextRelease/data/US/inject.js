const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', '(' + random(3, 3) + ')-' + random(3, 3) + '-' + random(3, 4));
    include(inc, contents, 'cell', '(' + random(3, 3) + ')-' + random(3, 3) + '-' + random(3, 4));
    include(inc, contents, 'id', {
        name: 'SSN',
        value: random(3, 3) + '-' + random(3, 2) + '-' + random(3, 4)
    });
    include(inc, contents, 'picture', pic);
};