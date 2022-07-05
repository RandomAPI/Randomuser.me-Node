const {random, randomItem, include,} = require('../../api');

module.exports = (inc, contents) => {
    const mobileProviders = ['66', '67', '68', '96', '97', '98', '99'];

    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', '(0' + randomItem(mobileProviders) + ') ' + random(4, 1) + random(3, 2) + '-' + random(3, 4));
    include(inc, contents, 'cell', '(0' + randomItem(mobileProviders) + ') ' + random(4, 1) + random(3, 2) + '-' + random(3, 4));
    include(inc, contents, 'id', {
        name: '',
        value: null
    });
    include(inc, contents, 'picture', pic);
};
