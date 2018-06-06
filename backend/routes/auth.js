var express = require('express');
var auth = express.Router();
var users = require('./users');
var jwt = require('jsonwebtoken');
var tools = require('./tools');
var passport = require('passport');
var LocalStrategy = require("passport-local");
var FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
var JawboneStrategy = require('passport-jawbone').Strategy;
var fs = require("fs");
var request = require('request');
var requests = require('./requests');
var passwordHash = require('password-hash');

//---------------------------------oauth2 part-------------------------------------------------------------------------
const FitBitCLIENT_ID = '228MXT';
const FitBitCLIENT_SECRET = '909186504aa2d6a9fc95be8b577bee16';
const FitBitcallbackURL = 'http://localhost:3000/auth/fitbit/verify';


const JaWBoneCLIENT_ID = 'D2Yo_4NGqX4';
const JaWBoneCLIENT_SECRET = '8dadc5e0ec9020b6b7a1cefff28eb2701c7d0e6c';
const JaWBonecallbackURL = 'http://localhost:3000/auth/jawbone/verify';

passport.serializeUser(function (user, done) {
    done(null, user.email);
});
// deserializeUser 在每次请求的时候将会根据用户名读取 从 session 中读取用户的全部数据
// 的对象，并将其封装到 req.user
passport.deserializeUser(function (email, done) {
    users.findByEmail(email, function (err, user) {
        if (err) {
            return done(err);
        }
        done(null, user);
    });
});

passport.use(new FitbitStrategy({
        clientID: FitBitCLIENT_ID,
        clientSecret: FitBitCLIENT_SECRET,
        callbackURL: FitBitcallbackURL,
        passReqToCallback: true
    },
    function (req, accessToken, refreshToken, profile, done) {
        var newUser = req.user;
        newUser.accessToken = accessToken;
        newUser.refreshToken = refreshToken;
        newUser.deviceID = profile.id;
        newUser.provider = "fitbit";
        users.updateUser(newUser.email, newUser, function (err, user) {
            if (err) {
                done(err)
            } else {
                done(null, user);
            }
        })
    }
));


passport.use(new JawboneStrategy({
        clientID: JaWBoneCLIENT_ID,
        clientSecret: JaWBoneCLIENT_SECRET,
        callbackURL: JaWBonecallbackURL,
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function (req, accessToken, refreshToken, profile, done) {

        // console.log(profile);
        // console.log(accessToken);
        var newUser = req.user;
        newUser.accessToken = accessToken;
        newUser.refreshToken = refreshToken;
        newUser.deviceID = profile.meta.user_xid;
        newUser.provider = "jawbone";
        users.updateUser(newUser.email, newUser, function (err, user) {
            if (err) {
                done(err);
            } else {
                done(null, user);
            }

        })
    }
));


var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        // console.log(req.user);
        return next()
    }
    res.redirect("/");
};

auth.get('/fitbit', isAuthenticated, function (req, res) {
    passport.authenticate('fitbit', {
        scope: ['activity', 'heartrate', 'location', 'profile', 'nutrition', 'sleep', 'social', 'weight'],
        state: req.user.email
    })(req, res)
});

auth.get('/jawbone', isAuthenticated, function (req, res) {
    passport.authorize('jawbone', {
        scope: ['move_read', 'extended_read', 'location_read', 'friends_read', 'mood_read', 'sleep_read', 'meal_read', 'weight_read', 'basic_read', 'generic_event_read', 'heartrate_read']
    })(req, res);
});


auth.get('/fitbit/verify*', passport.authenticate('fitbit', {
    successRedirect: '/auth/fitbit/success',
    failureRedirect: '/auth/fitbit/failure'
}));

auth.get('/fitbit/success', function (req, res, next) {
    // console.log(req.user);
    sendSuccessPage(req, res, "FitBit")
});

auth.get('/fitbit/failure', function (req, res, next) {


});


auth.get('/jawbone/verify*', passport.authenticate('jawbone', {
    successRedirect: '/auth/jawbone/success',
    failureRedirect: '/auth/jawbone/failure'
}));

auth.get('/jawbone/success', function (req, res, next) {
    // console.log(req.user);
    sendSuccessPage(req, res, "Jawbone")
});

auth.get('/jawbone/failure', function (req, res, next) {


});


//_____________________________________config-(this part is for local login)------------------------------------------
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (username, password, done) {

        users.findByEmail(username, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'No such user'});
            } else if (passwordHash.verify(password, user.password ) && user.active) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Some wrong Info'});
            }
        })
    }
));
//-----------------------------------------------------------------------------------------------------


//--------------------------------------------router--------------------------------------------------------------------
auth.post("/register", (req, res) => {
    var user = req.body;
    user.password = passwordHash.generate(user.password );
    users.createUser(user.email, user, function (err, result) {

        if (result.msg) {
            sendAuthError(res);
        } else {
            // console.log(result);
            tools.sendMail(result.email, result.activeToken);
            var token = jwt.sign(result.email, "123");
            res.json({firstName: result.firstName, token: token, email: result.email, provider: result.provider});
        }
    })
});

auth.get("/logout", function (req, res) {
    req.logOut();
    res.json({"Logout": "success"});
});


auth.post('/login', passport.authenticate('local', {failureFlash: true}), function (req, res) {
    sendToken(req, res)
});


auth.post('/user/avatar', isAuthenticated, function (req, res) {// update avatar


    console.log(req.body.avatar.value);

    users.updateAvatar(req.user.email, req.body.avatar, function (err, result) {
        if (err) {
            throw err;
        } else {
            res.json(result.avatar);
        }
    })

});

auth.get('/user/avatar', isAuthenticated, function (req, res) {// update avatar


    users.findByEmail(req.user.email, function (err, result) {
        if (err) {
            throw err;
        } else {
            res.json(result.avatar ? result.avatar : {});
        }
    })

});


auth.get("/user/email/:email", isAuthenticated, function (req, res) {
    console.log("33333" + req.params.email);
    users.findByEmail(req.params.email, function (err, result) {
        if (err) {
            throw err;
        } else {
            if (result) {
                delete result.password;
                console.log(delete result.password)
            }
            res.json(result);
        }
    })
});

auth.get("/user/device/fitbit/data", isAuthenticated, function (req, res) {


    if (req.user.accessToken) {
        // console.log(req.user.accessToken);

        request({
            url: 'https://api.fitbit.com/1/user/' + req.user.deviceID + '/activities/date/today.json',
            headers: {'Authorization': "Bearer " + req.user.accessToken}
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                var data = JSON.parse(body);


                var dailyReport = {"steps": 0, "distance": 0, "calories": 0};
                if (data && data.summary) {
                    console.log(data.summary);
                    if (data.summary.steps) {
                        dailyReport.steps = data.summary.steps;
                    }
                    if (data.summary.caloriesOut) {
                        dailyReport.calories = data.summary.caloriesOut;
                    }
                    if (data.summary.distances[0].distance) {
                        dailyReport.distance = data.summary.distances[0].distance;
                    }
                }
                users.updateDailyReport(req.user.email, dailyReport, function (err, user) {
                    if (err) {
                        throw err;
                    } else {
                        // console.log(user.dailyReport);
                    }
                });


                res.json(data);
            }
        })
    } else {
        res.json({"msg": "bind your device first"});
    }
});


auth.get("/user/device/jawbone/data/:kind", isAuthenticated, function (req, res) {
    var now = new Date();

    var dateString = tools.transferDateToString(now);
    console.log(dateString);
    if (req.user.accessToken) {
        var urlString = 'https://jawbone.com/nudge/api/v.1.1/users/' + req.user.deviceID + '/' + req.params.kind + '?date=' + dateString;
        request({
            url: urlString,
            headers: {'Authorization': "Bearer " + req.user.accessToken}
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                var data = JSON.parse(body).data.items;
                console.log(data);
                var dailyReport = {"steps": 0, "distance": 0, "calories": 0};
                if (data && data[0] && data[0].details && req.params.kind === "moves") {
                    if (data[0].details.steps) {
                        dailyReport.steps = data[0].details.steps;
                    }
                    if (data[0].details.km) {
                        dailyReport.distance = data[0].details.km;
                    }
                    console.log(data[0].details.wo_calories)
                    console.log(data[0].details.bg_calories)
                    console.log(data[0].details.bmr_day)
                    if (data[0].details.bmr_day) {
                        dailyReport.calories = parseInt(data[0].details.wo_calories + data[0].details.bg_calories + data[0].details.bmr_day);
                    }
                    users.updateDailyReport(req.user.email, dailyReport, null);
                    console.log(dailyReport);
                }

                res.json(data);
            }
        })
    } else {
        res.json({"msg": "bind your device first"});
    }
});


auth.get("/user/fitbit/data/:start/:end/:kind", isAuthenticated, function (req, res) {
    if (req.user.accessToken) {
        var version = 1;
        var path = '/activities/';
        if (req.params.kind === 'sleep') {
            version = 1.2;
            path = '/'
        }
        if (req.params.kind == "weight") {
            request({
                url: 'https://api.fitbit.com/1/user/' + req.user.deviceID + '/body/log/weight/date/' + req.params.start + '/' + req.params.end + '.json',
                headers: {'Authorization': "Bearer " + req.user.accessToken}
            }, function (error, response, body) {

                res.json(JSON.parse(body))
            });
        } else {
            var urlString = 'https://api.fitbit.com/' + version + '/user/' + req.user.deviceID + path + req.params.kind + '/date/' + req.params.start + '/' + req.params.end + '.json';

            request({
                url: urlString,
                headers: {'Authorization': "Bearer " + req.user.accessToken}
            }, function (error, response, body) {

                res.json(JSON.parse(body))
            });
        }

    }

})

auth.get("/user/jawbone/data/:start/:end/:kind", isAuthenticated, function (req, res) {
    if (req.user.accessToken) {
        request({
            url: 'https://jawbone.com/nudge/api/v.1.1/users/' + req.user.deviceID + '/' + req.params.kind + '?start_time=' + req.params.start + '&end_time=' + req.params.end,
            headers: {'Authorization': "Bearer " + req.user.accessToken}
        }, function (error, response, body) {
            // console.log(body);
            res.json(JSON.parse(body).data.items)
        });

    }

});


auth.get("/confirm/:activeToken", function (req, res) {
    var activeToken = req.params.activeToken;
    users.updateStatus(activeToken, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.msg) {
            res.json({activate: "failure"});
        } else {
            res.json({activate: "success"});
        }
    })
});
//----------------------------------------request----------------------------------------------------

auth.post('/request/email/:email', isAuthenticated, function (req, res) {

    if (req.user.email === req.params.email) {
        res.json()
    } else {
        requests.createRequest(req.user.email, req.params.email, function (err, result) {
            if (err) {
                throw err;
            } else {
                console.log(result);
                res.json(result)
            }

        })
    }

});
auth.get('/request', isAuthenticated, function (req, res) {

    requests.getRequests(req.user.email, function (err, result) {
        if (err) {
            throw err;
        } else {
            res.json(result)
        }
    })

});
auth.delete('/request/:uid', isAuthenticated, function (req, res) {
    requests.deleteRequest(req.params.uid, function (err, result) {
        if (err) {
            throw err;
        } else {
            console.log(result)
            res.json(result);
        }
    })

});


//----------------------------------------friend--------------------------------------------------------------------


auth.get("/friends", function (req, res) {// get all friends


    users.findByEmail(req.user.email, function (err, user) {
        if (err) {
            throw err;
        } else {

            res.json(user.friends);
        }

    })
})


auth.get("/friends/:friendId", function (req, res) {// get all friends


    users.findByEmail(req.params.friendId, function (err, user) {
        if (err) {
            throw err;
        } else {
            res.json({
                "email": user.email,
                "provider": user.provider,
                "dailyReport": user.dailyReport,
                "firstName": user.firstName,
                "lastName": user.lastName,
                "steps": user.dailyReport.steps,
                "distance": user.dailyReport.distance,
                "calories": user.dailyReport.calories,
                "avatar": "data:" + user.avatar.filetype + ";base64," + user.avatar.value,
            });
        }
    })


})


Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};


auth.delete("/friends/:friendId", function (req, res) {// delete a friend
    console.log("f4564");
    users.findByEmail(req.user.email, function (err, user) {
        if (err) {
            throw err;
        } else {
            users.findByEmail(req.params.friendId, function (err, user) {
                user.friends.remove(req.user.email);
                users.updateFriends(req.params.friendId, user.friends);
            })
            user.friends.remove(req.params.friendId);
            users.updateFriends(user.email, user.friends, function (err, user) {
                res.json(user.friends);
            })
        }

    })
});


auth.put("/friends/:email", isAuthenticated, function (req, res) {// add a friend

    users.addAFriend(req.user.email, req.params.email);
    users.addAFriend(req.params.email, req.user.email, function (err, result) {
        res.json(result.friends);
    });

});


//--------------------------------------------router--------------------------------------------------------------------


//--------------------------------------------function------------------------------------------------------------------


function sendToken(req, res) {


    var token = jwt.sign(req.user.email, "123");
    return res.json({firstName: req.user.firstName, token: token, email: req.user.email, provider: req.user.provider});
}

function sendAuthError(res) {
    return res.json({success: false});
}

function checkAutnenticated(req, res, next) {
    if (!req.header('authorization')) {
        return res.status(401).send({message: "Unauthorized request (no header)"});
    }
    var token = req.header('authorization').split(' ')[1];
    var playload = jwt.decode(token, "123");

    if (!playload) {
        return res.status(401).send({message: "Unauthorized request (not match with id)"});
    }
    req.user = playload;
    next();
}


function sendSuccessPage(req, res, kind) {
    var string = "<div  style=\"margin-top: 10%\">\n" +
        "    <div style=\"display: block\">\n" +
        "        <h1 style=\"color: white\">Congratulations !</h1>\n" +
        "        <h3 style=\"color: white\">Bind " + kind + "</h3>\n" +
        "        <h3 style=\"color: white\">successfully</h3>\n" +
        "    </div>\n" +
        "    <br>\n" +
        "    <div style=\"display: block\">\n" +
        "        <a href=\"javascript:window.opener=null;window.open('','_self');window.close();\">\n" +
        "            <button class=\"btn btn-info\">OK</button>\n" +
        "        </a>\n" +
        "    </div>\n" +
        "</div>";

    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('./result.html', null, function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write('File not found!');
        } else {
            res.write(data);
            res.write(string);
        }
        res.end();
    });
}

function sendFailurePage(req, res) {
    var string = "<div style=\"margin-top: 10%\">\n" +
        "    <div style=\"display: block\">\n" +
        "        <h1 style=\"color: white\">So Sorry</h1>\n" +
        "        <h2 style=\"color: white\">Something wrong!</h2>\n" +
        "    </div>\n" +
        "    <br>\n" +
        "    <div style=\"display: block\">\n" +
        "        <a href=\"javascript:window.opener=null;window.open('','_self');window.close();\">\n" +
        "            <button class=\"btn btn-info\">OK</button>\n" +
        "        </a>\n" +
        "    </div>\n" +
        "</div>";

    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('./result.html', null, function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write('File not found!');
        } else {
            res.write(data);
            res.write(string);
        }
        res.end();
    });
}

//--------------------------------------------function------------------------------------------------------------------


module.exports = auth;