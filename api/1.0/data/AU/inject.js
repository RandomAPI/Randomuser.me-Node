module.exports = (inc, contents) => {
    var pic = contents.picture;
    delete contents.picture;

    include(inc, 'phone', '0' + range(0, 9) + '-' + range(0, 9) + random(3, 3) + '-' + random(3, 4));
    include(inc, 'cell', '04' + random(3, 2) + '-' + random(3, 3) + '-' + random(3, 3));
    include(inc, 'id', {
        name: 'TFN',
        value: random(3, 9)
    });
    include(inc, 'picture', pic);
    include(inc, 'location', () => {
        contents.location.postcode = range(200, 9999); // Override common postcode with AU range

        // Override common postcode with AU range
        var oldStreet = contents.location.street;
        contents.location.street = contents.location.street.replace(/(\d+)/, range(1,9999));
    });
};