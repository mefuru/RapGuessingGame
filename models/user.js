var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.development.dbUrl);

var userSchema = new mongoose.Schema({
    fbId: String,
    name: String,
    email: {type String, lowercase: true}
// add fields as and when required
});

module.exports = mongoose.model('User', userSchema);
