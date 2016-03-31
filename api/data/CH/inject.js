module.exports = function(contents) {
    var pic = contents.picture;
    delete contents.picture;

    var femaleTitles = ["mademoiselle", "madame"];
    contents.name.title = contents.gender === "male" ? "monsieur" : randomItem(femaleTitles);
    contents.location.postcode = range(1000, 9999);
    contents.phone = "(" + random(3, 3) + ")-" + random(3, 3) + "-" + random(3, 4);
    contents.cell = "(" + random(3, 3) + ")-" + random(3, 3) + "-" + random(3, 4);
    contents.idName  = "AVS";
    contents.idValue = "756." + random(4, 4) + "." + random(4, 4) + "." + random(3, 2);
    contents.picture = pic;
};