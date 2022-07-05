const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', randomItem([7, 8, 9]) + random(3, 9));
    include(inc, contents, 'cell', randomItem([7, 8, 9]) + random(3, 9));
    include(inc, contents, 'id', {
        name: 'UIDAI',
        value: random(3, 12)
    });
    include(inc, contents, 'picture', pic);
};
