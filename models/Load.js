const mongoose = require('mongoose');

const loadSchema = mongoose.Schema({
  date: {
    type: Date,
    unique: true
  },
  'load': Number
});
loadSchema.index({date: 1}, {unique: true});

const Load = mongoose.model('Load', loadSchema);

module.exports = Load;