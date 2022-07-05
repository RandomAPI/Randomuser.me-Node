const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', random(4, 1) + random(3, 2) + ' ' + random(4, 1) + random(3, 2) + '-' + random(3, 4));
    include(inc, contents, 'cell', random(4, 1) + random(3, 2) + ' ' + random(4, 1) + random(3, 2) + '-' + random(3, 4));
    include(inc, contents, 'id', () => {
        const checkSIN = (sin) => {
            const check = '121212121';
            const result = sin
                .split('')
                .map((num, index) => {
                    let res = num * check[index];
                    if (res >= 10) {
                        res = String(res).split('').reduce((a,b) => +a + +b);
                    }
                    return res
                })
                .reduce((a, b) => a + b);
            
            return result % 10 === 0;
        };
        const genSIN = () => {
            let sin = random(3, 9);
            while(!checkSIN(sin)){
                sin = random(3, 9);
            }
            return sin;
        };
        contents.id = {
            name: 'SIN',
            value: genSIN()
        };
    });
    include(inc, contents, 'location', () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const postcodes = letters[range(0,25)] + random(3, 1) + letters[range(0,25)] + ' ' + random(3, 1) + letters[range(0,25)] + random(3, 1);
        contents.location.postcode = postcodes;
    });
    include(inc, contents, 'picture', pic);
};