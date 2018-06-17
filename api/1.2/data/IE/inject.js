module.exports = (inc, contents) => {
    var pic = contents.picture;
    delete contents.picture;

    include(inc, 'phone', '0' + range(1, 7) + '1-' + random(3, 3) + '-' + random(3, 4));
    include(inc, 'cell', '081-' + random(3, 3) + '-' + random(3, 4));
    include(inc, 'id', {
        name: 'PPS',
        value: random(3, 7) + 'T' + (Math.floor(new Date(contents.dob).getTime()/1000) >= 1356998400 ? 'A' : '')
    });
    include(inc, 'picture', pic);
};
