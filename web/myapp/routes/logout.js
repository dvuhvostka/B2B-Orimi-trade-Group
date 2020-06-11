var app = require('../app');
var express = require('express');
var logout = express.Router();

const redirectLogin = function(req,res,next){
  if(!app.userID){
    res.redirect('/login')
  }else {
    next()
  }
}

logout.route('/logout')
.post(redirectLogin, function(req,res){
  console.log('You are logged out!')
  res.redirect('/login')
});

module.exports   = logout;
