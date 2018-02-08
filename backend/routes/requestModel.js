var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    from: String,
    destination: String,
    // status: String,
    uid:String,

});

userSchema.set('toJSON', {
    transform: function (doc, result) {
        delete result.__v; // mongo internals
        delete result._id; // mongo internals
    }
});

var Request = mongoose.model('Request', userSchema)
module.exports = Request;