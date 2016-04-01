module.exports = (inc, contents) => {
    var pic = contents.picture;
    delete contents.picture;

    include(inc, 'phone', '0' + random(3, 2) + '-' + random(3, 8));
    include(inc, 'cell', '09' + random(3, 2) + '-' + random(3, 3) + '-' + random(3, 4));
    include(inc, 'id', {
        name: '',
        value: null
    });
    include(inc, 'picture', pic);
};