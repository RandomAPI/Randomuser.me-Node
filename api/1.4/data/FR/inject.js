const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', '0' + range(1, 5) + '-' + random(3, 2) + '-' + random(3, 2) + '-' + random(3, 2) + '-' + random(3, 2));
    include(inc, contents, 'cell', '06-' + random(3, 2) + '-' + random(3, 2) + '-' + random(3, 2) + '-' + random(3, 2));
    include(inc, contents, 'id', () => {
        const dobDate = new Date(contents.dob.date);
        const gender = contents.gender === 'male' ? 1 : 2;
        const year = dobDate.getYear();
        const month = dobDate.getMonth().toString().padStart(2, '0');
        const lloookkk = random(3, 8);
        const cc = (97 - (Number(`${gender}${year}${month}${lloookkk}`) % 97)).toString().padStart(2, '0');

        contents.id = {
            name: 'INSEE',
            value: `${gender}${year}${month}${lloookkk} ${cc}`
        };
    });
    include(inc, contents, 'picture', pic);
};