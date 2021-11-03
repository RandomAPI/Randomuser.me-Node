
const {random, randomItem, include,} = require('../../api');

module.exports = (inc, contents) => {
    const district = ['1', '2', '3'];
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', '0' + randomItem(district) + random(3, 1) + '-' + random(3, 4) + '-' + random(3, 3));
    include(inc, contents, 'cell', '06' + random(3, 1) + '-' + random(3, 4) + '-' + random(3, 3));
    include(inc, contents, 'id', {
        name: 'SID',
        value: random(3, 9)
    });
    include(inc, contents, 'picture', pic);
};
