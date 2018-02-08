let express = require('express');
let api = require('./routes/api');
let auth = require('./routes/auth');
let mongoose = require('mongoose');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let passport = require('passport');
let expressSession = require('express-session');
let app = express();
let flash = require('express-flash');
let contentType = require('content-type')
let getRawBody = require('raw-body')


app.listen(3000);
app.use(bodyParser.json({limit: '5mb'}));


// let io = require('socket.io').listen(server);
//
// let numberOfOnlineUsers = 0;
//
// io.on('connection', (socket) => {
//     console.log('New user connected');
    // console.log(socket);
    // socket.emit('request', /* */)
    // numberOfOnlineUsers++;
    // io.emit('numberOfOnlineUsers', numberOfOnlineUsers);
    //
    // socket.on('user_login', function(user) {
    //     console.log("log in");
    //     console.log(info)
            // io.emit('user',"fef")
        // const { tokenId, userId, socketId } = info;
        // addSocketId(users, { tokenId, socketId, userId });
    // });

    // socket.on('disconnect', () => {
    //     numberOfOnlineUsers--;
    //     io.emit('numberOfOnlineUsers', numberOfOnlineUsers);
    //     console.log('User disconnected');
    // });
// });

app.use(cookieParser());
app.use(bodyParser());
app.use(expressSession({
    secret: 'like',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header('Access-Control-Allow-Credentials', true);

    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');

    if (req.method === "OPTIONS") res.send(200);/*让options请求快速返回*/
    else next();
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected")
});
mongoose.connect('mongodb://localhost/Fitness');




app.use('/api', api);
app.use('/auth', auth);

module.exports = app;