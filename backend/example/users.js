var User = require('./userModel');

/*
 * userDb is an object having
 * user.email as keys
 * and user objects as values
 */

function findByEmail(email, cb) {
    User.findOne({'email': email}, cb);
}
module.exports.findByEmail = findByEmail;


function findUserByid(_id, cb) {
    User.findOne({"_id": _id}, cb)
}
module.exports.findUserByid = findUserByid;

function updateDefaultsByID(_id, defaults, cb) {
    User.findOne({'_id': _id}, function (err, user) {
        if (err) {
            cb(err, null)
        }
        else {
            user.defaults = defaults;
            user.save(cb);
        }
    })
}




module.exports.updateDefaultsByID = updateDefaultsByID;

function findAll(cb) {
    User.find({}, cb);
}
module.exports.findAll = findAll;

function updateUser(email, newUser, cb) {
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            cb(err, null)
        } else {
            User.findOne({'email': newUser.email}, function (err, quasiUser) {
                if (err) {
                    cb(err, null)
                } else {
                    if (quasiUser && quasiUser.email != email) {
                        cb(err, {msg: "Email already exists!"})
                    } else {
                        user.name.first = newUser.name.first;
                        user.name.last = newUser.name.last;
                        user.email = newUser.email;
                        user.role = newUser.role;
                        user.status = newUser.status;
                        user.save(cb)
                    }
                }
            })

        }
    })
}
module.exports.updateUser = updateUser;

function createUser(email, newUser, cb) {
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            cb(err, null)
        } else {
            if (user) {
                cb(err, {msg: "Email already exists!"})
            } else {
                new User({
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    status: newUser.status,
                    password: newUser.password,
                    defaults: {},
                }).save(cb);
            }

        }
    })
}





module.exports.createUser = createUser;

function findSpecificUser(flag, filter, cb) {
    console.log(flag + " ", filter);
    var containsRegEx = ".*" + filter + ".*";
    var query = {"status": flag};
    query.$or = [
        {'email': filter},
        {"name.first": {$regex: containsRegEx}},
        {"name.last": {$regex: containsRegEx}},
    ];
    console.log(query);
    User.find(query, cb);
}
module.exports.findSpecificUser = findSpecificUser;