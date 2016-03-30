module.exports = function(contents) {
    var pic = contents.picture;
    delete contents.picture;

    contents.phone = "0" + range(1, 7) + "1-" + random(3, 3) + "-" + random(3, 4);
    contents.cell = "081-" + random(3, 3) + "-" + random(3, 4);
    contents.PPS = random(3, 7) + "T" + (contents.dob >= 1356998400 ? "A" : "");
    contents.picture = pic;
};