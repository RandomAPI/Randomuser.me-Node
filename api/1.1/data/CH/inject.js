module.exports = (inc, contents) => {
    var pic = contents.picture;
    delete contents.picture;

    include(inc, 'name', () => {
        var femaleTitles = ['mademoiselle', 'madame'];
        contents.name.title = contents.gender === 'male' ? 'monsieur' : randomItem(femaleTitles);
    });

    include(inc, 'location', () => {
        contents.location.postcode = range(1000, 9999);
    });

    include(inc, 'phone', '(' + random(3, 3) + ')-' + random(3, 3) + '-' + random(3, 4));
    include(inc, 'cell', '(' + random(3, 3) + ')-' + random(3, 3) + '-' + random(3, 4));
    include(inc, 'id', {
        name: 'AVS',
        value: '756.' + random(4, 4) + '.' + random(4, 4) + '.' + random(3, 2)
    });
    include(inc, 'picture', pic);
};