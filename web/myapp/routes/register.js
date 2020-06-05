var express = require('express');
var router = express();
var path = require('path');
var bodyParser = require('body-parser');


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


/* GET users listing. */
router.route('/')
  .get(function(req, res) {
    res.sendFile(path.resolve(__dirname, '../public/register.html'));
  })
  .post(function(req,res){
    var errCode = reg_data_checker(req.body);
    //res.redirect('/register');
    if (errCode!=0) {res.send("err"+errCode)} else {
      res.send("true") //выводим код ошибки. Если ошибки нет, выводим true.
      // ЗАНОСИМ ДАННЫЕ В БД.
    }
  });

module.exports = router;
