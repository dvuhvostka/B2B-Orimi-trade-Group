"use strict"

var express = require('express');
var router = express();
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var pgp = require("pg-promise")(/*options*/);
var config = require('../config');
var app = require('../app');
const { v4: uuidv4 } = require('uuid');

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
    console.log("\n\nregister page\n\n")
    if(!userinfo.user_id){
    res.render('register.pug',{
      isRegister: req.session.userId,
      title: 'Регистрация',
    });
  }else {
    res.redirect('/');
  }
  })
  //  res.sendFile(path.resolve(__dirname, '../public/register.html'));
  //})
  .post(function(req,res){
    console.log(req.body.customRadioInline1);
    var errCode = reg_data_checker(req.body);
    var ip = req.ip;
    var ip_result = ip.replace("::ffff:", "");
    //res.redirect('/register');
    if (errCode!=0) {
      res.json({
        ok:false,
        error: "Ошибка регистрации. Повторите попытку позже или обратитесь к нашему техническому специалисту",
      });
    } else {
       //выводим код ошибки. Если ошибки нет, выводим true.
      // ЗАНОСИМ ДАННЫЕ В БД.
      db.any('SELECT * FROM users WHERE email = $1', req.body.email)
      .then(function (data) {
          if(data.length != 0){
          var  error = "Данный адрес электронной почты "+data[0].email+" уже зарегистрирован!";
            //res.render('/error_regiter.pug')
            //нужно сообщить клиенту, что этот email уже занят.
            res.json({
              ok:false,
              error: error
            });
          } else {
            userinfo.user_id = uuidv4();
            db.none('INSERT INTO users(username, second_name , third_name, email, password, ip_addr, balance, permissions, client_type, number, id) VALUES(${username}, ${second_name}, ${third_name}, ${email}, ${password}, ${ip_addr}, ${balance}, ${permissions}, ${client_type}, ${number}, ${id})',  {
                username: req.body.name,
                second_name: req.body.second_name,
                third_name: req.body.third_name,
                email: req.body.email,
                password: md5(req.body.password),
                ip_addr: ip_result,
                balance: 0,
                permissions: 'user',
                client_type: req.body.customRadioInline1,
                number: req.body.phone_number,
                id: userinfo.user_id
            });
            res.json({
              ok:true,
            })
          }
      })
      .catch(error => {
       console.log('ERROR:', error);
      });
    }
  });

module.exports = router;
