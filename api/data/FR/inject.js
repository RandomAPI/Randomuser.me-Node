module.exports = function(contents) {
    var pic = contents.picture;
    delete contents.picture;

    contents.phone = "0" + range(1, 5) + "-" + random(3, 2) + "-" + random(3, 2) + "-" + random(3, 2) + "-" + random(3, 2);
    contents.cell = "06-" + random(3, 2) + "-" + random(3, 2) + "-" + random(3, 2) + "-" + random(3, 2);

    var dobDate = new Date(Number(contents.dob + "000"));
    var day   = dobDate.getDay();
    var month = dobDate.getMonth();
    var year  = String(dobDate.getFullYear()).substr(2, 2);

    contents.INSEE = (contents.gender === "male" ? "1" : "2") + year + month + random(3, 8) + " " + random(3, 1) + range(0, 7);
    contents.picture = pic;
};