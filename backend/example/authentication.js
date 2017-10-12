var express = require('express');
var router = express.Router();
var users = require('./users.js');
var metadatas = require('./metadatas')
var passwordHash = require('password-hash');
router.post('/logout', function (req, res, next) {
    req.session.regenerate(function (err) {
        res.json({msg: 'ok'});
    });
});

router.post('/login', function (req, res, next) {
    req.session.regenerate(function (err) {
        users.findByEmail(req.body.username, function (err, user) {
            if (user && passwordHash.verify(req.body.password, user.password) && user.status) {
                req.session.user = user;
                delete user.password;
                user.password = "";
                var csrf = guid();
                req.session.csrf = csrf;
                res.set({
                    csrf: csrf,
                })
                res.json(user);
            } else {
                res.json({msg: 'Error with username/password or status'});
            }
        });
    });
});


router.get('/user', function (req, res, next) {
    var user = req.session.user;
    var csrf = req.header('csrf');
    if (csrf != req.session.csrf) {
        res.status(403).send('Invalid user!');
        return;
    }
    if (user) {
        users.findUserByid(user._id, function (err, userOfDatabase) {
            if (userOfDatabase && user._id == userOfDatabase._id && user.role == userOfDatabase.role && userOfDatabase.status) {
                delete userOfDatabase.password;
                userOfDatabase.password = "";
                res.json(userOfDatabase);
            }
        })
    } else {
        res.status(403).send('Invalid user!');
    }
});

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

module.exports = router;
