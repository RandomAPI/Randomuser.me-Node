const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', '(' + random(4, 1) + random(3, 2) + ') ' + random(4, 1) + random(3, 2) + '-' + random(3, 4));
    include(inc, contents, 'cell', '(' + random(4, 1) + random(3, 2) + ') ' + random(4, 1) + random(3, 2) + '-' + random(3, 4));
    include(inc, contents, 'id', () => {
        const checkSSN = (ssn) => {
            const regex = new RegExp("^(?!219-09-9999|078-05-1120)(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$");
            return regex.test(ssn);
        };
        const genSSN = () => {
            let ssn = random(3, 3) + '-' + random(3, 2) + '-' + random(3, 4);
            while(!checkSSN(ssn)){
                ssn = random(3, 3) + '-' + random(3, 2) + '-' + random(3, 4);
            }
            return ssn;
        };
        contents.id = {
            name: 'SSN',
            value: genSSN()
        }
    });
    include(inc, contents, 'picture', pic);
};