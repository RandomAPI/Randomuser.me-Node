var mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
    date: Date,
    site: Number,
    extension: Number,
    sketch: Number,
    chrome: Number,
    total: Number,
    "10": Number
});

var Request = mongoose.model('Request', requestSchema);

module.exports = Request;
