/**
 * Created by apple on 2017/3/25.
 */
var mongoose = require('mongoose');

var metadataSchema=mongoose.Schema({
    levels:mongoose.Schema.Types.Mixed,
    fonts:Array,
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
metadataSchema.set('toJSON',{
    transform: function (doc, result, options) {
        delete result._id; // mongo internals
        delete result.__v; // mongo internals
    }
})
var Metadata=mongoose.model('Metadata',metadataSchema);
module.exports = Metadata;
