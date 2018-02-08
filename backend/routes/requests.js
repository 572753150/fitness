var Request = require('./requestModel');
var tools=require('./tools');


function createRequest(from, destination, cb) {
    new Request({
        from:from,
        destination:destination,
        uid:tools.guid(),
    }).save(cb);
}
module.exports.createRequest = createRequest;


function deleteRequest(uid,cb) {
    Request.findOneAndRemove({"uid":uid},cb);
}
module.exports.deleteRequest = deleteRequest;


function getRequests(destination,cb) {
    Request.find({"destination":destination},cb);
}
module.exports.getRequests = getRequests;