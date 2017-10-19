var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var livereload = require('livereload');
var api = require('./routes/api');
var auth = require('./routes/auth')
var mongoose = require('mongoose');
var passport = require('passport');
var FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
var app = express();


app.use(session({secret: 'keyboard cat'}));

app.use(passport.initialize());
app.use(passport.session({
    resave: false,
    saveUninitialized: true
}));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected")
});
mongoose.connect('mongodb://localhost/Fitness');

app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Accept,Authorization");
//     next();
// });

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});





var fitbitStrategy = new FitbitStrategy({
        clientID: '228MXT',
        clientSecret: '909186504aa2d6a9fc95be8b577bee16',
        scope: ['activity', 'heartrate', 'location', 'profile'],
        callbackURL: 'http://localhost/verify',
    },
    function (accessToken, refreshToken, profile, done) {
        // TODO: save accessToken here for later use
        console.log(" till here ================");
        done(null, {
            accessToken: accessToken,
            refreshToken: refreshToken,
            profile: profile
        });

    }
);

passport.use(fitbitStrategy);
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
var fitbitAuthenticate = passport.authenticate('fitbit', {
    successRedirect: '/auth/fitbit/success',
    failureRedirect: '/auth/fitbit/failure'
});
app.get('/auth/fitbit', fitbitAuthenticate, function (req, res) {
    console.log("kkkkkkk")
    console.log(req);
    console.log(res)
});
app.get('/auth/fitbit/callback', fitbitAuthenticate);
app.get('/auth/fitbit/success', function (req, res, next) {
    res.send(req.user);
});
app.use('/api', api);
app.use('/auth', auth);
app.listen(3000);
app = livereload.createServer({
    exts: ['html', 'css', 'js', 'png', 'gif', 'jpg', 'ts']
});
module.exports = app;