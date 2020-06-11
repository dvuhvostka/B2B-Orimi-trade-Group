"use strict"

var express = require('express');
var router = express();
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://s0rax:12345@25.58.69.64:5432/mydb");
var app = require('../app');

function xss_check(replace){
  var pattern = /script|javascript|src|onerror|%|<|>/g;
  if(replace.u1.search(pattern)<0 && replace.e1.search(pattern)<0) return false; else return true;
}




function reg_data_checker(data)
{
  console.log(data);
  switch (true) {
    case data.p1 != data.p2: return 1; break; // err1 пароли не совпадают
    case data.p1.length<6 || data.p2.length<6: return 2; break; //err2 пароль слишком короткий
    case data.u1.length <3 || data.u1.length>14: return 3; break; //err3 имя пользователя длиннее 14 или короче 3
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
    res.sendFile(path.resolve(__dirname, '../public/register.html'));
  })
  .post(function(req,res){
    var errCode = reg_data_checker(req.body);
    var ip = req.ip;
    var ip_result = ip.replace("::ffff:", "");
    //res.redirect('/register');
    if (errCode!=0) {res.send("err"+errCode)} else {
      res.send("true") //выводим код ошибки. Если ошибки нет, выводим true.
      // ЗАНОСИМ ДАННЫЕ В БД.
      db.any('SELECT * FROM users WHERE email = $1', req.body.e1)
      .then(function (data) {
          if(data.length != 0){
            console.log("Email already registred: "+data[0].email);
            //нужно сообщить клиенту, что этот email уже занят.
          } else {
            db.none('INSERT INTO users(username, email, password, ip_addr, balance, permissions, client_type, number) VALUES(${username}, ${email}, ${password}, ${ip_addr}, ${balance}, ${permissions}, ${client_type}, ${number})',  {
                username: req.body.u1,
                email: req.body.e1,
                password: md5(req.body.p1),
                ip_addr: ip_result,
                balance: 0,
                permissions: 'user',
                client_type: req.body.c1,
                number: req.body.n1
            });
          }
      })
      .catch(error => {
       console.log('ERROR:', error);
   });
    }
  });

module.exports = router;
