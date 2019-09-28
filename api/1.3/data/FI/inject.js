const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', '0' + range(2, 9) + '-' + random(3, 3) + '-' + random(3, 3));
    include(inc, contents, 'cell', '04' + range(0, 9) + '-' + random(3, 3) + '-' + random(3, 2) + '-' + random(3, 2));
    include(inc, contents, 'id', () => {
        const dob = contents.dob;
        const dobDate = new Date(dob);
        const full_year = dobDate.getFullYear();

        const day = dobDate.getDay();
        const month = dobDate.getMonth();
        const year = String(full_year).substr(2, 2);

        let century;
        if (full_year < 1900) {
            century = '+';
        } else if (full_year >= 1900 && full_year < 2000) {
            century = '-';
        } else {
            century = 'A';
        }

        const zzz = random(3, 2) + (contents.gender !== 'male' ? randomItem([0, 2, 4, 6, 8]) : randomItem([1, 3, 5, 7, 9]));
        const checksum_str = '0123456789ABCDEFHJKLMNPRSTUVWXY';

        const cc = checksum_str[(day + month + year + zzz) % 31];

        const hetu = day + month + year + century + zzz + cc;

        contents.id = {
            name: 'HETU',
            value: hetu
        };
    });

    include(inc, contents, 'picture', pic);
};