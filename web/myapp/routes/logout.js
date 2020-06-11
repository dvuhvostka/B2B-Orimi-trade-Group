var app = require('../app');
var express = require('express');
var logout = express.Router();
const session = require('express-session');
var {Pool, Client} = require('pg');
const pgSession = require('connect-pg-simple')(session);


logout.route('/logout')
.post(function(req, res) {
  res.send('hello world');
})
.get(function(req, res) {
  res.send('hello world');
});

module.exports   = logout;
