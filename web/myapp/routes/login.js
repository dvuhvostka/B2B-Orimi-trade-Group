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
    user: "s0rax",
    password: "MffdwehqsqAREs228T",
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
      console.log("\n\nlogin page\n\n");
      if(req.session.userId){
        res.redirect('/')
      }else {
      res.render('login.pug', {
        title: 'Вход',
      });
    }
    })
    .post(function(req, res){
      var error;
      const {email, password} = req.body;
      try {
        pgPool.query(query,[email,md5(password)], function(err, resp){
          if(resp.rows.length!=0){
            req.session.userId = resp.rows[0].id;
            res.json({
              ok:true,
            })
          } else {
            error = "Неверное имя пользователя или пароль";
            res.json({
              ok:false,
              error:error,
            })
          }
        });
      } catch (e) {
        console.log("error: "+e);
      }
});


module.exports = {
  login: login,
}
