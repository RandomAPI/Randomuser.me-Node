module.exports = (inc, contents) => {
    var pic = contents.picture;
    delete contents.picture;

    include(inc, 'phone', random(3, 3) + '-' + random(3, 3) + '-' + random(3, 4));
    include(inc, 'cell', random(3, 3) + '-' + random(3, 3) + '-' + random(3, 4));
    include(inc, 'id', {
        name: '',
        value: null
    });
    include(inc, 'location', () => {
      var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

      var postcode = letters[range(0,25)] + random(3, 1) + letters[range(0,25)] + ' ' + random(3, 1) + letters[range(0,25)] + random(3, 1);

      contents.location.postcode = postcodes;
    });

    include(inc, 'picture', pic);
};
