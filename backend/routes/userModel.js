var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    role: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    active: Boolean,
    activeToken: String,
    activeExpires: Date,
    accessToken: String,
    refreshToken: String,
    deviceID:String,
    provider:String,
    dailyReport:{
        steps: Number,
        calories:Number,
        distance:Number,
    },
    friends :[],
    avatar:{},
});







userSchema.set('toJSON', {
    transform: function (doc, result) {
        delete result.__v; // mongo internals
        delete result._id; // mongo internals
    }
});

var User = mongoose.model('User', userSchema)
module.exports = User;