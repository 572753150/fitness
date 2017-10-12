/**
 * Created by apple on 2017/3/29.
 */
var mongoose = require('mongoose');
var wordlistSchema=mongoose.Schema({
    words:Array,
});
wordlistSchema.set('toJSON',{
    transform: function (doc, result, options) {
        delete result._id; // mongo internals
        delete result.__v; // mongo internals
    }
})
var Wordlist=mongoose.model('Wordlist',wordlistSchema);
module.exports = Wordlist;