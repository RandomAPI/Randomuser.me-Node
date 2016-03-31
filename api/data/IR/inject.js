module.exports = function(contents) {
    var pic = contents.picture;
    delete contents.picture;

    contents.phone = "0" + random(3, 2) + "-" + random(3, 8);
    contents.cell = "09" + random(3, 2) + "-" + random(3, 3) + "-" + random(3, 4);

    // TODO
    contents.idName  = "";
    contents.idValue = null;

    contents.picture = pic;
};