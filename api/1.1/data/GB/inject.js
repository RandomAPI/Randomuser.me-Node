const {random, randomItem, pad, range, uppercaseify, include,} = require('../../api');

module.exports = (inc, contents) => {
    var pic = contents.picture;
    delete contents.picture;

    include(inc, contents, 'phone', () => {
      var phones = [
        '01' + random(3, 3) + ' ' + random(3, 5),
        '01' + random(3, 3) + ' ' + random(3, 6),
        '011' + random(3, 1) + random(3, 3) + ' ' + random(3, 3) + ' ' +  random(3, 4),
        '01' + random(3, 1) + '1 ' + random(3, 3) + ' ' + random(3, 4),
        '013873' + ' ' + random(3, 5),
        '015242' + ' ' + random(3, 5),
        '015394' + ' ' + random(3, 5),
        '015395' + ' ' + random(3, 5),
        '015396' + ' ' + random(3, 5),
        '016973' + ' ' + random(3, 5),
        '016974' + ' ' + random(3, 5),
        '016977' + ' ' + random(3, 4),
        '016977' + ' ' + random(3, 5),
        '017683' + ' ' + random(3, 5),
        '017684' + ' ' + random(3, 5),
        '017687' + ' ' + random(3, 5),
        '019467' + ' ' + random(3, 5),
        '02' + random(3, 1) + ' ' + random(3, 4) + ' ' + random(3, 4)
      ];

      contents.phone = randomItem(phones);
    });

    include(inc, contents, 'cell', '07' + random(3, 2) + '-' + random(3, 3) + '-' + random(3, 3));

    include(inc, contents, 'location', () => {
      var code = 'ABDEFGHJLNPQRSTUWXYZ';

      var postcodes = [
        random(4, 1) + random(3, 1) + ' ' + random(3, 1) + code[range(0, 19)] + code[range(0, 19)],
        random(4, 2) + random(3, 1) + ' ' + random(3, 1) + code[range(0, 19)] + code[range(0, 19)],
        random(4, 1) + random(3, 2) + ' ' + random(3, 1) + code[range(0, 19)] + code[range(0, 19)],
        random(4, 2) + random(3, 2) + ' ' + random(3, 1) + code[range(0, 19)] + code[range(0, 19)],
        random(4, 2) + random(3, 1) + random(4, 1) + ' ' + random(3, 1) + code[range(0, 19)] + code[range(0, 19)],
        random(4, 1) + random(3, 1) + random(4, 1) + ' ' + random(3, 1) + code[range(0, 19)] + code[range(0, 19)]
      ];

      contents.location.postcode = randomItem(postcodes);
    });

    include(inc, contents, 'id', () => {
      nino_1 = 'abceghjklmnoprstwxyz';
      nino_2 = 'abceghjklmnprstwxyz';

      nino = (nino_1[range(0, 19)] + nino_2[range(0, 18)] + ' ' + random(3, 2) + ' ' +  random(3, 2) + ' ' + random(3, 2) + ' ' + random(4, 1)).toUpperCase();

      contents.id = {
        name: 'NINO',
        value: nino
      };
    });

    include(inc, contents, 'picture', pic);
};