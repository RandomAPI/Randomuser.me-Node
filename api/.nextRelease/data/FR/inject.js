const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', '0' + range(1, 5) + '-' + random(3, 2) + '-' + random(3, 2) + '-' + random(3, 2) + '-' + random(3, 2));
    include(inc, contents, 'cell', '06-' + random(3, 2) + '-' + random(3, 2) + '-' + random(3, 2) + '-' + random(3, 2));
    include(inc, contents, 'id', () => {
        const dobDate = new Date(contents.dob);
        const day   = dobDate.getDay();
        const month = dobDate.getMonth();
        const year  = String(dobDate.getFullYear()).substr(2, 2);

        contents.id = {
            name: 'INSEE',
            value: (contents.gender === 'male' ? '1' : '2') + year + month + random(3, 8) + ' ' + random(3, 1) + range(0, 7)
        };
    });
    include(inc, contents, 'picture', pic);
};