var express = require('express');
var auth = express.Router();
var users= require('./users');
var jwt = require('jsonwebtoken');
var tools = require('./tools');
var passport = require('passport');


//--------------------------------------------router--------------------------------------------------------------------
auth.post("/register",(req, res)=>{
    var user = req.body;
    console.log(user);
    users.createUser(user.email,user,function (err, result) {
        if(result.msg){
            sendAuthError(res);
        }else{
            console.log(result);
            tools.sendMail(result.email,result.activeToken);
            sendToken(result,res);
        }
    })
} );

auth.post("/login",(req, res)=>{
    users.findByEmail(req.body.email,function (err, result) {
        if(!result){
            sendAuthError(res);
        }else if( result.password == req.body.password && result.active){
            sendToken(result,res)
        }else {
            sendAuthError(res);
        }
    })
} );

auth.get("/confirm/:activeToken",function (req, res) {
    var activeToken = req.params.activeToken;
    console.log("confirm",activeToken);
    users.updateStatus(activeToken,function (err, result) {
        if(err){
            throw err;
        }
        if(result.msg){
            res.json({activate: "failure"});
        }else{
            res.json({activate: "success"});
        }
    })
});

// auth.get('/fitbit',
//     passport.authenticate('fitbit', { scope: ['activity','heartrate','location','profile'] }
//     ));
//
// auth.get( '/fitbit/callback', passport.authenticate( 'fitbit', {
//     successRedirect: '/auth/fitbit/success',
//     failureRedirect: '/auth/fitbit/failure'
// }));
//--------------------------------------------router--------------------------------------------------------------------



//--------------------------------------------function------------------------------------------------------------------


function sendToken(user,res) {
    var token = jwt.sign(user.email,"123");
    return res.json({firstName: user.firstName, token: token});
}

function sendAuthError(res){
    return res.json({success:false});
}

function checkAutnenticated(req,res,next) {
    if(!req.header('authorization')){
        return res.status(401).send({message: "Unauthorized request (no header)"});
    }
    var token = req.header('authorization').split(' ')[1];
    var playload = jwt.decode(token,"123");

    if(!playload){
        return res.status(401).send({message: "Unauthorized request (not match with id)"});
    }
    req.user = playload;
    next();

}
//--------------------------------------------function------------------------------------------------------------------


module.exports = auth;