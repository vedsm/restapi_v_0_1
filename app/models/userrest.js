/**
 * Created by ved on 8/2/16.
 */
// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('UserRest', new Schema({
    name: String,
    password: String,
    admin: Boolean
}));