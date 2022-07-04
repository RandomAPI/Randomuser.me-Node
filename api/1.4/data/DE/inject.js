const {random, randomItem, pad, range, uppercaseify, include} = require('../../api');

module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', '0' + random(3, 3) + '-' + random(3, 7));
    include(inc, contents, 'cell', '017' + random(3, 1) + '-' + random(3, 7));
    include(inc, contents, 'id', () => {
        const dobDate = new Date(contents.dob.date);
        const genSVNR = () => {
            const pension = [
                '02', '03', '04', '08', '09', '10', '11',
                '12', '13', '14', '15', '16', '17', '18',
                '19', '20', '21', '23', '24', '25', '26',
                '28', '29', '38', '39', '40', '42', '43',
                '44', '45', '46', '47', '48', '49', '50',
                '51', '52', '53', '54', '55', '56', '57',
                '58', '59', '60', '61', '62', '63', '64',
                '65', '66', '67', '68', '69', '70', '71',
                '72', '73', '74', '75', '76', '77', '78',
                '79', '80', '81', '82', '89'
            ];
            return `${randomItem(pension)} ${pad(dobDate.getDate(), 2)}${pad(dobDate.getMonth() + 1, 2)}${dobDate.getYear()} ${contents.name.last[0]} ${contents.gender === 'male' ? pad(range(0,49), 2) : pad(range(50, 99), 2)}${range(0, 9)}`;
        };
        contents.id = {
            name: 'SVNR',
            value: genSVNR()
        };
    });
    include(inc, contents, 'picture', pic);
};