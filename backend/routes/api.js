var express = require('express');
var api = express.Router();

var healthInfo={height:"198cm", weight: "170 Lb",distance: "10 km", last:"Guo", step: "2333"};



api.get('/healthInfo',(req,res)=>{

    res.send( healthInfo);
});
api.post('/healthInfo',(req,res)=>{
    console.log(req.body);
    healthInfo = req.body;
    res.send(healthInfo);
});

// router.get('/users/me',checkAutnenticated,(req,res)=>{
//
//     console.log(req.user);
//     res.json(req.user);
// })

module.exports = api;

