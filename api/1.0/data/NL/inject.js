module.exports = (inc, contents) => {
    var pic = contents.picture;
    delete contents.picture;

    include(inc, 'phone', '(' + random(3, 3) + ')-' + random(3, 3) + '-' + random(3, 4));
    include(inc, 'cell', '(' + random(3, 3) + ')-' + random(3, 3) + '-' + random(3, 4));
    include(inc, 'id', {
        name: 'BSN',
        value: random(3, 8)
    });
    include(inc, 'picture', pic);
};