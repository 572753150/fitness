var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var cors = require('cors-express');

// var sslOptions = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem'),
//     passphrase:"7749"
// };
var app = express();
var bodyParser = require('body-parser');

var api = require('./routes/api');
var auth = require('./routes/auth')
var mongoose = require('mongoose');
var passport = require('passport');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database connected")
});
mongoose.connect('mongodb://localhost/Fitness');

app.use(bodyParser.json());

// options = {
//     allow: {
//         origin: '*',
//         methods: 'GET,PATCH,PUT,POST,DELETE,HEAD,OPTIONS',
//         headers: 'Content-Type, Authorization, Content-Length, X-Requested-With, X-HTTP-Method-Override'
//     },
//     expose: {
//         headers: null
//     },
//     max: {
//         age: null
//     },
//     options: function (req, res, next) {
//         if (req.method == 'OPTIONS') {
//             res.status(200).end();
//         } else {
//             next();
//         }
//     },
//     specials: {
//         powered: null
//     }
// };
//
// app.use(cors(options))


app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Credentials", true);
    // res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
    res.header("Access-Control-Allow-Headers","*");
    // res.header("Access-Control-Allow-Headers", "x-requested-with, authorization, Content-Type, Authorization, credential, X-XSRF-TOKEN");
    next();
});



var FitbitStrategy = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;

passport.use(new FitbitStrategy({
        clientID:     '228MXT',
        clientSecret: '909186504aa2d6a9fc95be8b577bee16',
        callbackURL: 'http://localhost/verify'
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ fitbitId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));
app.get('/', function (req, res) {
    res.send("Hello World!");
});
app.use('/api',api);
app.use('/auth',auth);
// http.createServer(app).listen(1213);
// https.createServer(sslOptions,app).listen(1214);
app.listen(1214);

module.exports =app;