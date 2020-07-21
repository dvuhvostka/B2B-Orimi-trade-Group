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

user.get('/user', redirectLogin, function(req, res, next) {
  res.render('user',{
    isRegistred: req.session.userId
  })
});

module.exports = user;
