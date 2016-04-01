var mongoose     = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

var requestSchema = mongoose.Schema({
    date: Date,
    "1_0": Number,
    "bandwidth": Number
});

requestSchema.plugin(findOrCreate);

var Request = mongoose.model('Request', requestSchema);

module.exports = Request;
