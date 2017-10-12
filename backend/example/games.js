/**
 * Created by apple on 2017/3/1.
 */
var Game = require('./gameModel');

function create(colors, font, guesses, id, level, remaining, status, target, timeStamp, timeToComplete, view, userId, cb) {//need to be considered
    new Game({
        colors, font, guesses, id, level, remaining, status, target,
        timeStamp, timeToComplete, view, userId
    }).save(cb);

};
module.exports.create = create;

function findByUserId(userId, cb) {

    Game.find({'userId': userId}, cb)
}
module.exports.findByUserId = findByUserId;

function find(gameID, cb) {
    Game.findOne({'id': gameID}, cb);
}
module.exports.find = find;

function update(gameId, newGame, cb) {

    Game.findOne({'id': gameId}, function (err, game) {
        if (err) {
            cb(err, null);
        } else {
            game = newGame;
            game.save(cb);
        }
    })
}
module.exports.update = update;

