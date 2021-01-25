const {random, randomItem, include,} = require('../../api');

module.exports = (inc, contents) => {
    const mobileProviders = ['066', '067', '068', '096', '097', '098', '099'];

    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', '(' + randomItem(mobileProviders) + random(3, 2) + ') ' + random(4, 1) + random(3, 2) + '-' + random(3, 4));
    include(inc, contents, 'cell', '(' + random(4, 1) + random(3, 2) + ') ' + random(4, 1) + random(3, 2) + '-' + random(3, 4));
    include(inc, contents, 'id', {
        name: '',
        value: null
    });
    include(inc, contents, 'picture', pic);
};
