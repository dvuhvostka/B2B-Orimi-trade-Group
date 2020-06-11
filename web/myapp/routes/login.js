var express = require('express');
var login = express.Router();
var path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
var {Pool, Client} = require('pg');
var bodyParser = require('body-parser')
var crypto = require('crypto');
var app = require('../app')

/* GET users listing. */

const TWO_DAYS = 1000 * 60 * 60 * 24 * 2; //2 days in miliseconds

function checkLogged (){


}

  //var for sessions and connecting to databse
  const {
    SESS_LIFETIME = TWO_DAYS,
    ENVIRONMENT = 'development',
    SESS_NAME = 'sid',
    SESS_SECRET = 'ssh!quiet,it\'dexat0randz0rax!',
    USER = 'dexat0r',
    PASSWORD = '121212',
    HOST = 'localhost'
  } = process.env
  //while we develop the web site ENVIRONMENT = development and IN_PROD = false.
  const IN_PROD = ENVIRONMENT === 'production';
  //coneccting to database config
  var pgPool = new Pool({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: 'mydb'
  });


  //Coockies, session config
  login.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
      secure: IN_PROD,
    },
    store: new pgSession({
        pool: pgPool,
        tableName: 'session'
    })
  }))
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
      res.sendFile(path.resolve(__dirname, '../public/login.html'));
    })
    .post(function(req, res){
      const {email, password} = req.body;
      console.log(email + ' ' + password)
      console.log(req.body.email + ' ' + req.body.password)
      pgPool.query(query,[email,md5(password)], function(err, res){
        //console.log(err,res)
          if(!err){
            console.log(res.rows[0].id);
            pgPool.end();
          }
      })

      res.redirect('/')

    });





module.exports = login;
