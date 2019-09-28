const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', random(3, 8));
    include(inc, contents, 'cell', random(3, 8));

    let dobDate = new Date(contents.dob.date.slice(0, -1));
    include(inc, contents, 'id', {
        name: 'CPR',
        value: `${pad(dobDate.getDate(), 2)}${pad(dobDate.getMonth() + 1, 2)}${dobDate.getYear()}-${random(3, 4)}`
    });
    include(inc, contents, 'picture', pic);
};
