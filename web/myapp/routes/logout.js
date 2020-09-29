var app = require('../app');
var express = require('express');
var logout = express.Router();
var cookieParser = require('cookie-parser')
var session = require('express-session')



logout.use(session({
  secret:'ssh!quiet,it\'dexat0randz0rax!',
  resave: false,
  saveUninitialized: false
}))
logout.route('/logout')
.get(function(req, res) {
  //res.send('hello world');
  console.log("\n\nlogged out\n\n");
  console.log('cookies: ' + JSON.stringify(req.session.id));
  req.session.destroy(function(err){
    if(err){
      console.log(err);
    }
    res.clearCookie('sid');
    res.redirect('/');
  })
})


module.exports   = logout;
