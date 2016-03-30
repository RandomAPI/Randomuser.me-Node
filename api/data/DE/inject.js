module.exports = function(contents) {
    var pic = contents.picture;
    delete contents.picture;

    contents.phone = "0" + random(3, 3) + "-" + random(3, 7);
    contents.cell = "017" + random(3, 1) + "-" + random(3, 7);
    contents.picture = pic;
};