const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'name', () => {
        const femaleTitles = ['Mademoiselle', 'Madame'];
        contents.name.title = contents.gender === 'male' ? 'Monsieur' : randomItem(femaleTitles);
    });

    include(inc, contents, 'location', () => {
        contents.location.postcode = range(1000, 9999);
    });

    let prefix = ['075', '076', '077', '078', '079'];
    include(inc, contents, 'phone', `${randomItem(prefix)} ${random(3, 3)} ${random(3, 2)} ${random(3, 2)}`);
    include(inc, contents, 'cell', `${randomItem(prefix)} ${random(3, 3)} ${random(3, 2)} ${random(3, 2)}`);
    include(inc, contents, 'id', {
        name: 'AVS',
        value: '756.' + random(3, 4) + '.' + random(3, 4) + '.' + random(3, 2)
    });
    include(inc, contents, 'picture', pic);
};