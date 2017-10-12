/**
 * Created by apple on 2017/3/1.
 */
var mongoose = require('mongoose');

// function User(email, password, defaults) {
//     this.email = email;
//     this.password = password;
//     this.defaults = defaults;
// }

var userSchema = mongoose.Schema({
    role: String,
    email: String,
    password: String,
    status  : Boolean,
    name:{
        first:String,
        last:String,
    },
    defaults: {
        colors: {guessBackground: String, wordBackground: String, textBackground: String},
        level: {name: String, minLength: Number, maxLength: Number, guesses: Number},
        font: {
            url: String,
            rule: String,
            family: String,
            category: String
        }
    }
})

userSchema.set('toJSON', {
    transform : function( doc, result, options ) {
        delete result.__v; // mongo internals
        if(result.role&&result.role.toLowerCase().indexOf("admin")!=-1){
            delete result.defaults;
        }
    }
} )

var User=mongoose.model('User',userSchema)
module.exports = User;