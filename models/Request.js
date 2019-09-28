const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
  date: {
    type: Date,
    unique: true
  },
  'total': Number,
  'extension': Number,
  'api': Number,
  'sketch': Number,
  '0_1': Number,
  '0_2': Number,
  '0_2_1': Number,
  '0_3': Number,
  '0_3_1': Number,
  '0_3_2': Number,
  '0_4': Number,
  '0_4_1': Number,
  '0_5': Number,
  '0_6': Number,
  '0_7': Number,
  '0_8': Number,
  '1_0': Number,
  '1_1': Number,
  '1_2': Number,
  '1_3': Number,
  'bandwidth': Number
});
requestSchema.index({date: 1}, {unique: true});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;