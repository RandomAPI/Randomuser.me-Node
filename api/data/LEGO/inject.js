module.exports = function(contents) {
    var pic = contents.picture;
    delete contents.picture;

    contents.phone = "(" + random(3, 3) + ")-" + random(3, 3) + "-" + random(3, 4);
    contents.cell = "(" + random(3, 3) + ")-" + random(3, 3) + "-" + random(3, 4);

    contents.idName  = "";
    contents.idValue = null;

    contents.picture = pic;
};