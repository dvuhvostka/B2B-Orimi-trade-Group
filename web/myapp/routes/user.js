var express = require('express');
var user = express.Router();
var path = require('path');
var app = require('../app');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var config = require('../config');
var {Pool, Client} = require('pg');
var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://"+config.DB_USER+":"+config.DB_PASSWORD+"@"+config.DB_HOST+":5432/"+config.DB_NAME);

const {
  SESS_LIFETIME = config.SESS_TIME,
  ENVIRONMENT = config.ENVIRONMENT,
  SESS_NAME = config.SESS_NAME,
  SESS_SECRET = config.SESS_SECRET,
  USER = config.DB_USER,
  PASSWORD = config.DB_PASSWORD,
  HOST = config.DB_HOST,
  DBNAME = config.DB_NAME
} = process.env

var pgPool = new Pool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DBNAME
});

const redirectLogin = function(req,res,next){
  if(!req.session.userId){
    res.redirect('/login')
  }else {
    next()
  }
}

user.route('/user')
.get(redirectLogin, function(req, res, next) {
  var getUserData = `SELECT * FROM users WHERE id='`+req.session.userId+`'`;
  pgPool.query(getUserData,[], function(err, response){
    if((response.rows[0].name==null)&&(response.rows[0].second_name==null)){
      console.log(response.rows[0].number)
      res.render('user',{
        isRegistred: req.session.userId,
        user_name: 0,
        user_second_name: 0,
        number: response.rows[0].number
      })
    }else{
      res.render('user',{
        isRegistred: req.session.userId,
        user_name: response.rows[0].name,
        user_second_name: response.rows[0].second_name,
        number: response.rows[0].number
      })
    }
    console.log(response.rows)
  });
}).post(function(req,res){
    console.log(req.body.name);
    var add_name_and_sname = `UPDATE users SET name='`+req.body.name+`', second_name='`+req.body.sname+`' WHERE id='`+req.session.userId+`'`;
    pgPool.query(add_name_and_sname,[], function(err, response){});
    res.redirect('/user');
});

module.exports = user;
