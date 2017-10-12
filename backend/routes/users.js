var User = require('./userModel');

var tools=require('./tools')




function findByEmail(email, cb) {
    User.findOne({'email': email}, cb);
}
module.exports.findByEmail = findByEmail;


function findAll(cb) {
    User.find({}, cb);
}
module.exports.findAll = findAll;


function updateStatus(activeToken, cb) {
    console.log()
    User.findOne({activeToken: activeToken, activeExpires: {$gt: Date.now()}}, function (err, user) {
        if (err) return next(err);

        // 激活码无效
        if (!user) {
           cb(err,{msg: "code invalid"})
        }else{
            console.log(user);
            user.active = true ;
            user.save(cb);

        }

        // 激活并保存

    });
}

module.exports.updateStatus = updateStatus;

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
                        user.active = newUser.active;
                        user.save(cb)
                    }
                }
            })

        }
    })
}
module.exports.updateUser = updateUser;



function createUser(email, newUser, cb) {
    console.log(email);
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            cb(err, null)
        } else {
            if (user) {
                cb(err, {msg: "Email already exists!"})
            } else {
                console.log(tools.guid());
                var activeToken= tools.guid();
                var activeExpires= Date.now() + 24 * 3600 * 1000;


                new User({
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    role: newUser.role,
                    active: newUser.active,
                    password: newUser.password,
                    activeToken:activeToken,
                    activeExpires: activeExpires,
                }).save(cb);
            }

        }
    })
}
module.exports.createUser = createUser;




// function findSpecificUser(flag, filter, cb) {
//     console.log(flag + " ", filter);
//     var containsRegEx = ".*" + filter + ".*";
//     var query = {"status": flag};
//     query.$or = [
//         {'email': filter},
//         {"name.first": {$regex: containsRegEx}},
//         {"name.last": {$regex: containsRegEx}},
//     ];
//     console.log(query);
//     User.find(query, cb);
// }
// module.exports.findSpecificUser = findSpecificUser;