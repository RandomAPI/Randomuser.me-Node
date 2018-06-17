module.exports = (inc, contents) => {
    var pic = contents.picture;
    delete contents.picture;

    include(inc, 'phone', '9' + random(3, 2) + '-' + random(3, 3) + '-' + random(3, 3));
    include(inc, 'cell', '6' + random(3, 2) + '-' + random(3, 3) + '-' + random(3, 3));
    include(inc, 'id', {
        name: 'DNI',
        value: random(3, 8) + '-' + random(4, 1)
    });
    include(inc, 'picture', pic);
};