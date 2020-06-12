var app = require('../app');
var express = require('express');
var logout = express.Router();
var cookieParser = require('cookie-parser')
var session = require('express-session')

logout.use(cookieParser('ssh!quiet,it\'dexat0randz0rax!'))
logout.use(session({
  secret:'ssh!quiet,it\'dexat0randz0rax!'
}))
logout.route('/logout')
.post(function(req, res) {
  //res.send('hello world');
  console.log('cookies: ' + req.session.cookie);
})
.get(function(req, res) {

 res.send('hello world');
});

module.exports   = logout;
