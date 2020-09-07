var express = require('express');
var router = express.Router();
var path = require('path');
const session = require('express-session');
var bodyParser = require('body-parser')
var config = require('../config');
const pgp = require("pg-promise")(/*options*/);

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

function check_cart(cart) {
  var result = 1;
  var object_product = [];
  for (key in cart){
    //Паттерны регулярных выражений
    var p1 = /tea|coffee|other|horeca/g;
    var p2 = /[^tea|coffee|other|horeca]/g;

    // определение переменных для товара (парсинг корзины)
    var product_id = key.replace(p1, "");
    var product_type = key.replace(p2, "");
    var product_count = cart[key]*1;

    var obj = {
      id: product_id*1,
      type: product_type,
      count: product_count
    }
    if((!obj.id)||(!obj.type)||(!obj.count)){
      result = 0;
    }
    object_product.push(obj);
  }
  if(result){
    return object_product;
  }else{
    return 0;
  }
}

router.route('/order')
  .get(function(req,res){
    res.render('order.pug', {
      isRegistred: userinfo.user_id,
      title: 'Фирменный магазин Орими-трэйд',
      needFooter: false,
      });
  }).post(function(req,res){
    if(req.session.userId){
      switch (req.body.post_type) {
        case "getbalance": {
          var getuserbalance_sql = `SELECT * FROM users WHERE id='`+req.session.userId+`'`;
          db.any(getuserbalance_sql).then(function(balance_response){
            res.send(balance_response[0]);
          }).catch(function(e) {
            console.log("GETBALANCE_ERROR: ",e);
          });
          break;
        }
        case "delivery_info": {
          if(req.body.cart!=''){
            console.log(req.body.cart);
            var cart = JSON.parse(req.body.cart);
            var mycart = check_cart(cart); //Проверка корзины
            var error;
            if(!mycart){
              error = "ERROR_CART_CONTENT"; // Корзина была изменена вручную из браузера.
              res.json({
                ok: false,
                error
              })
            }else{
              // Проверить введенные поля
              // Получить цены товаров
              // Проверить баланс юзера, если он использует бонусные баллы
              // Посчитать итоговую цену
              // Занести сделку в бд.
            }
            console.log(mycart);
          }else{
            var error = "ERROR_EMPTY_CART"; //Пользователь прислал пустую корзину
            res.json({
              ok: false,
              error
            })
          }
          break;
        }
        default: {
          console.log(req.body);
          res.render('order.pug', {
            isRegistred: userinfo.user_id,
            title: 'Фирменный магазин Орими-трэйд',
            needFooter: false,
            });
            break;
        }
      }
    }
  });

module.exports = router;
