"use strict"

var express = require('express');
var router = express();
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://s0rax:12345@25.58.69.64:5432/mydb");
var app = require('../app');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
var {Pool, Client} = require('pg');
var config = require('../config');
const { v4: uuidv4 } = require('uuid');



const query = `
SELECT id
FROM users
WHERE email = $1
AND password = $2

`;

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
  user: USER,
  password: PASSWORD,
  database: DBNAME
});




function xss_check(replace){
  var pattern = /script|javascript|src|onerror|%|<|>/g;
  if(replace.name.search(pattern)<0 && replace.email.search(pattern)<0) return false; else return true;
}




function reg_data_checker(data)
{
  console.log(data);
  switch (true) {
    case data.password != data.confirm_password: return 1; break; // err1 пароли не совпадают
    case data.password.length<6 || data.confirm_password.length<6: return 2; break; //err2 пароль слишком короткий
    case data.name.length <1 || data.name.length>14: return 3; break; //err3 имя пользователя длиннее 14 или короче 3
    case xss_check(data): return 4; break;//err4 Обнаружена XSS в никнейме. Ввести другой ник.
    default: return 0; // Функция вернула 0. Ошибок нет.
  }
}

function md5(pass) {
  var hash = crypto.createHash('md5').update(pass).digest('hex');
  return hash;
}

/* GET users listing. */
router.route('/register')
  .get(function(req, res) {
    res.render('register.pug',{
      isRegister: true
    });
  })
  //  res.sendFile(path.resolve(__dirname, '../public/register.html'));
  //})
  .post(function(req,res){
    var errCode = reg_data_checker(req.body);
    var ip = req.ip;
    var ip_result = ip.replace("::ffff:", "");
    //res.redirect('/register');
    if (errCode!=0) {res.send("err"+errCode)} else {
       //выводим код ошибки. Если ошибки нет, выводим true.
      // ЗАНОСИМ ДАННЫЕ В БД.
      db.any('SELECT * FROM users WHERE email = $1', req.body.email)
      .then(function (data) {
          if(data.length != 0){
            console.log("Email already registred: "+data[0].email);
            //res.render('/error_regiter.pug')
            //нужно сообщить клиенту, что этот email уже занят.
          } else {
            db.none('INSERT INTO users(username, email, password, ip_addr, balance, permissions, client_type, number) VALUES(${username}, ${email}, ${password}, ${ip_addr}, ${balance}, ${permissions}, ${client_type}, ${number})',  {
                username: req.body.name,
                email: req.body.email,
                password: md5(req.body.password),
                ip_addr: ip_result,
                balance: 0,
                permissions: 'user',
                client_type: req.body.customRadioInline1,
                number: req.body.phone_number
            });
          }
      })
      .catch(error => {
       console.log('ERROR:', error);
   });
   //session and coockies
      userinfo.user_id = uuidv4();
      res.redirect('/');
    }
  });

module.exports = router;
