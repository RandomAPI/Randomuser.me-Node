module.exports = function(contents) {
    var pic = contents.picture;
    delete contents.picture;

    contents.phone = "9" + random(3, 2) + "-" + random(3, 3) + "-" + random(3, 3);
    contents.cell = "6" + random(3, 2) + "-" + random(3, 3) + "-" + random(3, 3);
    contents.idName  = "DNI";
    contents.idValue = random(3, 8) + "-" + random(4, 1);
    contents.picture = pic;
};