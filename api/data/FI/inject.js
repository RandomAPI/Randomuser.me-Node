module.exports = function(contents) {
    var pic = contents.picture;
    delete contents.picture;

    var dob = contents.dob;
    var dobDate = new Date(Number(dob + "000"));
    var full_year = dobDate.getFullYear();

    contents.phone = "0" + range(2, 9) + "-" + random(3, 3) + "-" + random(3, 3);
    contents.cell = "04" + range(0, 9) + "-" + random(3, 3) + "-" + random(3, 2) + "-" + random(3, 2);

    var day = dobDate.getDay();
    var month = dobDate.getMonth();
    var year = String(full_year).substr(2, 2);

    var century;
    if (full_year < 1900) {
        century = "+";
    } else if (full_year >= 1900 && full_year < 2000) {
        century = "-";
    } else {
        century = "A";
    }

    var zzz = random(3, 2) + (contents.gender !== "male" ? randomItem([0, 2, 4, 6, 8]) : randomItem([1, 3, 5, 7, 9]));
    var checksum_str = "0123456789ABCDEFHJKLMNPRSTUVWXY";

    var cc = checksum_str[(day + month + year + zzz) % 31];

    var hetu = day + month + year + century + zzz + cc;

    contents.HETU = hetu;
    contents.picture = pic;
};