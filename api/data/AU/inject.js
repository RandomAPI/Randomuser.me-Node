module.exports = function(contents) {
    var pic = contents.picture;
    delete contents.picture;

    contents.phone = "0" + range(0, 9) + "-" + range(0, 9) + random(3, 3) + "-" + random(3, 4);
    contents.cell = "04" + random(3, 2) + "-" + random(3, 3) + "-" + random(3, 3);
    contents.TFN   = random(3, 9);
    contents.picture = pic;
    contents.location.zip = range(200, 9999); // Override common zip with AU range

    // Override common zip with AU range
    var oldStreet = contents.location.street;
    contents.location.street = contents.location.street.replace(/(\d*) (.*)/, range(1,9999));
};