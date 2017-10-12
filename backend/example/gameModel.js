/**
 * Created by apple on 2017/3/1.
 */

var mongoose = require('mongoose');
var gameSchema = mongoose.Schema({
    colors: {
        guessBackground: String,
        wordBackground: String,
        textBackground: String
    },
    font: {
        url: String,
        rule: String,
        family: String,
        category: String
    },
    guesses: String,
    id: String,
    level: {
        name: String,
        minLength: Number,
        maxLength: Number,
        guesses: Number
    },
    remaining: Number,
    status: String,
    target: String,
    timeStamp: Number,
    timeToComplete: Number,
    view: String,
    userId: mongoose.Schema.ObjectId,
})

gameSchema.set('toJSON', {
    transform: function (doc, result, options) {
        delete result._id; // mongo internals
        delete result.__v; // mongo internals
    }
})


var Game = mongoose.model('Game', gameSchema);
module.exports = Game;
