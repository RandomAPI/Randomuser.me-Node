module.exports = function(inc, contents) {
    var pic = contents.picture;
    delete contents.picture;

    include(inc, "phone", "0" + range(1, 5) + "-" + random(3, 2) + "-" + random(3, 2) + "-" + random(3, 2) + "-" + random(3, 2));
    include(inc, "cell", "06-" + random(3, 2) + "-" + random(3, 2) + "-" + random(3, 2) + "-" + random(3, 2));
    include(inc, "id", function() {
        var dobDate = new Date(Number(contents.dob + "000"));
        var day   = dobDate.getDay();
        var month = dobDate.getMonth();
        var year  = String(dobDate.getFullYear()).substr(2, 2);

        contents.id = {
            name: "INSEE",
            value: (contents.gender === "male" ? "1" : "2") + year + month + random(3, 8) + " " + random(3, 1) + range(0, 7)
        };
    });
    include(inc, "picture", pic);
};