module.exports = (inc, contents) => {
    var pic = contents.picture;
    delete contents.picture;

    include(inc, 'phone', '0' + random(3, 3) + '-' + random(3, 7));
    include(inc, 'cell', '017' + random(3, 1) + '-' + random(3, 7));
    include(inc, 'id', {
        name: '',
        value: null
    });
    include(inc, 'picture', pic);
};