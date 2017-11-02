var express = require('express');
var session = require('express-session');
// var bodyParser = require('body-parser');
var api = require('./routes/api');
var auth = require('./routes/auth');
var mongoose = require('mongoose');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
// var cors = require("cors");
// var Fitbit  = require( 'fitbit-oauth2' );

//


var app = express();

app.use(cookieParser());
app.use(bodyParser());





var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected")
});
mongoose.connect('mongodb://localhost/Fitness');



app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');

    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});




app.use(session({ secret: 'keyboard cat' }));

app.use(passport.initialize());
app.use(passport.session({
    resave: false,
    saveUninitialized: true
}));

const CLIENT_ID = '228MXT';
const CLIENT_SECRET = '909186504aa2d6a9fc95be8b577bee16';

app.use(passport.initialize());

var fitbitStrategy = new FitbitStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        scope: ['activity','heartrate','location','profile'],
        callbackURL: "http://localhost:3000/verify"
    },
    function(accessToken, refreshToken, profile, done) {
        // TODO: save accessToken here for later use

        done(null, {
            accessToken: accessToken,
            refreshToken: refreshToken,
            profile: profile
        });

    }
);

passport.use(fitbitStrategy);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

var fitbitAuthenticate = passport.authenticate('fitbit', {
    successRedirect: '/auth/fitbit/success',
    failureRedirect: '/auth/fitbit/failure'
});

app.get('/auth/fitbit', fitbitAuthenticate);
app.get('verify', fitbitAuthenticate);

app.get('/auth/fitbit/success', function(req, res, next) {
    res.send(req.user);
});


// var fitbitStrategy = new FitbitStrategy({
//         clientID: '228MXT',
//         clientSecret: '909186504aa2d6a9fc95be8b577bee16',
//         scope: ['activity', 'heartrate', 'location', 'profile'],
//         callbackURL: 'http://localhost:3000/verify',
//     },
//     function (accessToken, refreshToken, profile, done) {
//         TODO: save accessToken here for later use
        // console.log(" till here ================");
        // done(null, {
        //     accessToken: accessToken,
        //     refreshToken: refreshToken,
        //     profile: profile
        // });
    //
    // }
// );
//
// passport.use(fitbitStrategy);
// passport.serializeUser(function (user, done) {
//     done(null, user);
// });
// passport.deserializeUser(function (obj, done) {
//     done(null, obj);
// });
// var fitbitAuthenticate = passport.authenticate('fitbit', {
//     successRedirect: '/auth/fitbit/success',
//     failureRedirect: '/auth/fitbit/failure'
// });
// app.get('/auth/fitbit', function (req, res) {
//     console.log("Execute here+ 谢玉");
//     res.redirect("https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=228MXT&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fverify&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800")
// });



// app.get('/verify*', function (req, res) {
//     res.json({"a":"success"});
// });
// app.get('/auth/fitbit/callback', fitbitAuthenticate);
// app.get('/auth/fitbit/success', function (req, res, next) {
//     res.send(req.user);
// });
app.use('/api', api);
app.use('/auth', auth);
app.listen(3000);
module.exports = app;