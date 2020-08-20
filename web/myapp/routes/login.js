var express = require('express');
var login = express.Router();
var path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
var {Pool, Client} = require('pg');
var bodyParser = require('body-parser')
var crypto = require('crypto');
var app = require('../app');
var config = require('../config');

global.userinfo = {
  user_id: null
}

/* GET users listing. */

//const TWO_DAYS = 1000 * 60 * 60 * 24 * 2; //2 days in miliseconds


  //var for sessions and connecting to databse
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
  //while we develop the web site ENVIRONMENT = development and IN_PROD = false.
  const IN_PROD = ENVIRONMENT === 'production';
  //coneccting to database config
  var pgPool = new Pool({
    host: HOST,
    user: "z0rax",
    password: "12345",
    database: DBNAME
  });

const query = `
SELECT id
FROM users
WHERE email = $1
AND password = $2

`;

function md5(pass) {
  var hash = crypto.createHash('md5').update(pass).digest('hex');
  return hash;
}

login.route('/login')
    .get(function(req,res){
      if(req.session.userId){
        res.redirect('/')
      }else {
      res.render('login.pug', {
        title: 'Вход',
      });
    }
    })
    .post(function(req, res){
      const {email, password} = req.body;
      console.log(email + ' ' + password)
try {
  pgPool.query(query,[email,md5(password)], function(err, res){
    console.log(res.rows);
    if(res.rows.length!=0){
      userinfo.user_id = res.rows[0].id;
    } else console.log("Undefined ID")
  });
} catch (e) {
  console.log("error: "+e);
}
    res.redirect('/shop');
});


module.exports = {
  login: login,
  //user_identifier: userinfo.user_id
}
