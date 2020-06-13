var express = require('express');
var user = express.Router();
var path = require('path');
var app = require('../app');
var cookieParser = require('cookie-parser');
var session = require('express-session');


const redirectLogin = function(req,res,next){
  if(!req.session.userId){
    res.redirect('/login')
  }else {
    next()
  }
}

user.use(session({
    secret:'ssh!quiet,it\'dexat0randz0rax!',
    resave: false,
    saveUninitialized: false
}))

user.get('/user', redirectLogin, function(req, res, next) {
  res.sendFile(path.resolve(__dirname, '../public/user.html'));
  console.log(app.userID)
});

module.exports = user;
