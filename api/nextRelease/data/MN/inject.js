const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');


module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone',  976 + '-' + random(3, 8));
    include(inc, contents, 'cell',  976 + '-' + random(3, 8));
    include(inc, contents, 'id', {
        name: 'RN',
        value: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 2) + random(3,8);
    });
    include(inc, contents, 'picture', pic);
};
