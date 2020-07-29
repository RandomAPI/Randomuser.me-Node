const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    const pic = contents.picture;
    delete contents.picture;

    let phone =  '(' + random(4, 1) + random(3, 2) + ') ' + random(4, 1) + random(3, 2) + '-' + random(3, 4);
    let cell = '(' + random(4, 1) + random(3, 2) + ') ' + random(4, 1) + random(3, 2) + '-' + random(3, 4);
    let annualIncome = range(1000, 10000000);
    let nonTaxableIncome = range(0, annualIncome - 1);
   
    include(inc, contents, 'phone', phone);
    include(inc, contents, 'cell', cell);
    include(inc, contents, 'id', {
        name: 'SSN',
        value: random(3, 3) + '-' + random(3, 2) + '-' + random(3, 4)
    });
    include(inc, contents, 'income', {
        annualIncome: annualIncome,
        nonTaxableIncome: nonTaxableIncome
    })
    include(inc, contents, 'picture', pic);
};
