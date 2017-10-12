/**
 * Created by apple on 2017/3/29.
 */
var Wordlist=require('./wordlistModel');
function saveWordlist(wordArr,cb) {
    new Wordlist({'words':wordArr}).save(cb)
}
module.exports.saveWordlist = saveWordlist;


function getwordArr(cb) {
    Wordlist.find({},cb)
}
module.exports.getwordArr = getwordArr;
