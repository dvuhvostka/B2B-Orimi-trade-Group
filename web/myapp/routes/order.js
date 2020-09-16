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

function isInteger(num) {
  num = num*1;
  return Number.isInteger(num);
}

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

add_deal_with_bonuses = (cart, data, userdata, bonuses, res, region) => {
  // console.log(bonuses);
  // console.log(payment_method);
  // console.log(userdata);
  // console.log(data);

var address, payment, bonuses, comments;
  switch(data.length){
    case 3: {
      payment = data[0];
      address = decodeURI(data[1]);
      comments = decodeURI(data[2]);
      bonuses = 0;
      break;
    }
    case 5: {
        bonuses = data[1];
        payment = data[2];
        address = decodeURI(data[3]);
        comments = decodeURI(data[4]);
      break;
    }
    default: break;
  }

  cart.fullcost -= Math.floor(bonuses); //Вычли бонусы из цены
  console.log(cart.fullcost);
  db.none('INSERT INTO deals_info(owner_id, confirmed, date, first_name_owner, second_name_owner, third_name_owner, delivery_address, final_price, payment_method, owner_contact, bonuses, comments, timestamp, region) VALUES(${owner_id}, ${confirmed}, ${date}, ${first_name_owner}, ${second_name_owner}, ${third_name_owner}, ${delivery_address}, ${final_price}, ${payment_method}, ${owner_contact}, ${bonuses}, ${comments}, ${timestamp}, ${region})', {
    owner_id: userdata[0].id,
    confirmed: 0,
    date: new Date(),
    first_name_owner: userdata[0].username,
    second_name_owner: userdata[0].second_name,
    third_name_owner: userdata[0].third_name,
    delivery_address: address,
    final_price: cart.fullcost,
    payment_method: payment,
    owner_contact: userdata[0].number,
    bonuses: Math.floor(bonuses),
    comments: comments,
    timestamp: Date.now(),
    region: region
  }).then(function(){
      // Записываем товары.
      if(bonuses){
        db.none("UPDATE users SET balance=balance-"+Math.floor(bonuses)+" WHERE id='"+userdata[0].id+"'");
      }
      db.one('SELECT * FROM deals_info WHERE id=(SELECT MAX(id) FROM deals_info)').then(function(deal){
        for (var i = 0; i<cart.length; i++){
        db.none('INSERT INTO deals(product, deal_owner, type, count, deal_id, sort, product_id, price_of_one, full_price, subtype, articul, deal_summ) VALUES(${product}, ${deal_owner}, ${type}, ${count}, ${deal_id}, ${sort}, ${product_id}, ${price_of_one}, ${full_price}, ${subtype}, ${articul}, ${deal_summ})',{
            product: cart[i].product,
            deal_owner: userdata[0].id,
            type: cart[i].type,
            count: cart[i].count,
            deal_id: deal.id,
            sort: cart[i].sort,
            product_id: cart[i].id,
            price_of_one: cart[i].price_of_one,
            full_price: cart[i].full_price,
            subtype: cart[i].subtype,
            articul: cart[i].articul,
            deal_summ: cart.fullcost
          }).catch(error=>{
            console.log(error);
          });
        }
      }).catch(error => {
        console.log(error);
      });
  }).catch(error =>{
    console.log(error);
  });
  var message = 'SUCCESS';
  res.json({
    ok: true,
    message
  })
}

returnCartCost = (data, res, response_type, bonuses, userId, payment_method, region) => {
  if(response_type=="ajax"){
    switch(data){
      case "PRODUCT_TYPE_ERROR": {
        var error = "PRODUCT_TYPE_ERROR";
        res.json({
          ok: false,
          error
        });
        break;
      }
      default: {
        var fullcost = data.fullcost;
        res.json({
          ok: true,
          data,
          fullcost
        });
        break;
      }
    }
  }else if(response_type=="check_bonus_with_cost"){

    if (bonuses*1){
      //console.log("BONUS INPUT IS VALID");
      console.log(userId)
      var getuserbalance_sql = `SELECT * FROM users WHERE id='`+userId+`'`;

      db.any(getuserbalance_sql).then(function(balance_response){
        if(balance_response[0].balance>=bonuses){
          if(bonuses>data.fullcost){
            var error = "ERROR_BONUS_COUNT"; //Пользователь прислал пустую корзину
            res.json({
              ok: false,
              error
            });
          }else{
            //Пользователь прошел проверку. У него на балансе достаточно бонусов. Он ввел меньше бонусов, чем стоит товар.
            var min_price = data.fullcost - bonuses;
            if(bonuses<1){
              var error = "ERROR_MIN_1_BONUS"; //Пользователь прислал пустую корзину
              res.json({
                ok: false,
                error
              });
            }else{
              if(isInteger(bonuses)){
                if(min_price>=2000){
                  switch(payment_method[2]){
                    case 'nal': break;
                    case 'beznal': console.log("ONLINE PAYMENT METHOD");break;
                    case 'bill': break;
                    default: console.log("NO_PAYMENT_METHOD_ERROR");
                  }
                  add_deal_with_bonuses(data, payment_method, balance_response, Math.floor(bonuses), res, region);
                  console.log('!SUCCESS!');
                }else{
                  var error = "ERROR_MIN_DEAL_PRICE_2000"; //Пользователь прислал пустую корзину
                  res.json({
                    ok: false,
                    error
                  });
                }
              }else{
                var error = "ERROR_ONLY_INT_COUNT"; //Пользователь прислал пустую корзину
                res.json({
                  ok: false,
                  error
                });
              }
            }
          }
        }else {
          var error = "ERROR_BALANCE"; //Пользователь прислал пустую корзину
          res.json({
            ok: false,
            error
          });
        }
      }).catch(function(e) {
        console.log("GETBALANCE_ERROR: ",e);
      });

    }else{
      var error = "ERROR_BONUS_INPUT";
      res.json({
        ok: false,
        error
      });
    }
  }else if(response_type=='without_bonus'){
        if(data.fullcost>=2000){
          var getuserbalance_sql = `SELECT * FROM users WHERE id='`+userId+`'`;
          db.any(getuserbalance_sql).then(function(balance_response){
            add_deal_with_bonuses(data, payment_method, balance_response, 0, res, region);
            console.log('!SUCCESS!');
          });
        }else{
          var error = "ERROR_MIN_DEAL_PRICE_2000"; //Пользователь прислал пустую корзину
          res.json({
            ok: false,
            error
          });
        }
  }
}

get_cart_cost = (cart, res, response_type, bonuses, userId, payment_method, region) => {
  switch(cart) {
    case 0: console.log("ERROR_CART_CONTENT"); break;
    default: {
      //Если полученный объект с данными корзины не пустой:
        console.log(cart);
        var tea_sql = `SELECT * FROM tea WHERE id=0`;
        var coffee_sql = `SELECT * FROM coffee WHERE id=0`;
        var horeca_sql = `SELECT * FROM horeca WHERE id=0`;
        var other_sql = `SELECT * FROM others WHERE id=0`;

        for (var i=0; i<cart.length; i++){
          switch(cart[i].type){
            case "tea":{
              tea_sql += ` OR id=`+cart[i].id;
              break;
            }
            case "coffee":{
              coffee_sql += ` OR id=`+cart[i].id;
              break;
            }
            case "horeca": {
              horeca_sql += ` OR id=`+cart[i].id;
              break;
            }
            case "other": {
              other_sql += ` OR id=`+cart[i].id;
              break;
            }
            default: {
              returnCartCost("PRODUCT_TYPE_ERROR", res, response_type, userId, payment_method, region);
              break;
            }
          }
        }
        db.task(async (t) => {
            let tea= await t.any(tea_sql);
            let coffee= await t.any(coffee_sql);
            let horeca= await t.any(horeca_sql);
            let others= await t.any(other_sql);
            return {tea,coffee,horeca,others};
        })
           .then(data => {
              var fullcost = 0;
               for(var i=0; i<cart.length; i++){
                 switch(cart[i].type){
                   case "tea":{
                      for(var x=0; x<data.tea.length; x++){
                        if(data.tea[x].id==cart[i].id){
                          var price = data.tea[x].item_price;
                          if (data.tea[x].sale_price!=0) price = data.tea[x].sale_price;
                          cart[i].price_of_one = price;
                          cart[i].full_price = Math.ceil((price*cart[i].count)*100)/100;
                          cart[i].sort = data.tea[x].sort;
                          cart[i].product = data.tea[x].item_name;
                          cart[i].subtype = 0;
                          cart[i].articul = data.tea[x].articul;
                          fullcost += cart[i].full_price;
                        }
                      }
                     break;
                   }
                   case "coffee":{
                     for(var x=0; x<data.coffee.length; x++){
                       if(data.coffee[x].id==cart[i].id){
                         var price = data.coffee[x].item_price;
                         if (data.coffee[x].sale_price!=0) price = data.coffee[x].sale_price;
                         cart[i].price_of_one = price;
                         cart[i].full_price = Math.ceil((price*cart[i].count)*100)/100;
                         cart[i].sort = data.coffee[x].sort;
                         cart[i].product = data.coffee[x].item_name;
                         cart[i].subtype = 0;
                         cart[i].articul = data.coffee[x].articul;
                         fullcost += cart[i].full_price;
                       }
                     }
                     break;
                   }
                   case "horeca": {
                     for(var x=0; x<data.horeca.length; x++){
                       if(data.horeca[x].id==cart[i].id){
                         var price = data.horeca[x].item_price;
                         if (data.horeca[x].sale_price!=0) price = data.horeca[x].sale_price;
                         cart[i].type = data.horeca[x].type;
                         cart[i].price_of_one = price;
                         cart[i].full_price = Math.ceil((price*cart[i].count)*100)/100;
                         cart[i].sort = data.horeca[x].sort;
                         cart[i].product = data.horeca[x].item_name;
                         cart[i].subtype = 'horeca';
                         cart[i].articul = data.horeca[x].articul;
                         fullcost += cart[i].full_price;
                       }
                     }
                     break;
                   }
                   case "other": {
                     for(var x=0; x<data.others.length; x++){
                       if(data.others[x].id==cart[i].id){
                         var price = data.others[x].item_price;
                         if (data.others[x].sale_price!=0) price = data.others[x].sale_price;
                         cart[i].price_of_one = price;
                         cart[i].full_price = Math.ceil((price*cart[i].count)*100)/100;
                         cart[i].product = data.others[x].item_name;
                         cart[i].subtype = 0;
                         cart[i].sort = data.others[x].sort;
                         cart[i].articul = data.others[x].articul;
                         fullcost += cart[i].full_price;
                       }
                     }
                     break;
                   }
                   default: {
                     returnCartCost("PRODUCT_TYPE_ERROR", res, response_type, Math.floor(bonuses), userId, payment_method, region);
                     break;
                   }
                 }
               }
               cart.fullcost = Math.ceil((fullcost)*100)/100;
               returnCartCost(cart, res, response_type, Math.floor(bonuses), userId, payment_method, region); //Передаем обновленную и пересчитанную корзину на вывод
           })
            .catch(error => {
            });

      break;
    }
  }
}

check_formdata = (formdata, cart, res, userId, region) => {
  var parsed_args = formdata.split('&');
  var array = [];
  for (var i = 0; i<parsed_args.length; i++){
    var pa = parsed_args[i].split('=');
    array.push(pa[1]);
  }

  var pattern = /<|>|src|script/g;
  switch(array.length){
    case 3:{
      array[1] = array[1].replace(pattern, "");
      array[2] = array[2].replace(pattern, "");
      // ЕСЛИ ПОЛЬЗОВАТЕЛЬ НЕ ИСПОЛЬЗУЕТ БОНУСЫ ДЛЯ ОПЛАТЫ.
      get_cart_cost(cart, res , "without_bonus", 0, userId, array, region);
      console.log('WITHOUT BONUSES');
      switch (array[0]) {
        case 'beznal': console.log("ONLINE PAYMENT METHOD"); break; //ПЕРЕНАПРАВЛЯЕМ КЛИЕНТА НА ОНЛАЙН КАССУ
        default: break;
      }
      break;
    }
    case 5:{
      array[3] = array[3].replace(pattern, "");
      array[4] = array[4].replace(pattern, "");
      // ЕСЛИ ПОЛЬЗОВАТЕЛЬ ПОСТАВИЛ ГАЛОЧКУ ИСПОЛЬЗОВАТЬ БОНУСЫ - ПРОВЕРЯЕМ ИХ НАЛИЧИЕ.
      get_cart_cost(cart, res , "check_bonus_with_cost", array[1], userId, array, region);
      console.log('WITH BONUSES: '+array[1]);
      break;
    }
    default: break;
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
        case "getcartcost": { // ЗАПРОС НА ПОЛУЧЕНИЕ ОБЩЕЙ СУММЫ КОРЗИНЫ
          if(req.body.cart!=''){
            var cart = JSON.parse(req.body.cart); // Получаем корзину
            var mycart = check_cart(cart); // Парсим и проверяем корзину
            console.log(req.body);
            get_cart_cost(mycart, res, "ajax", 0, req.session.userId, req.body.region);
          }else{
            var error = "ERROR_CART_EMPTY";
            res.json({
              ok: false,
              error
            });
          }
          break;
        }
        case "delivery_info": {
          if(req.body.cart!=''){
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
              // Идет проверка введенных данных и запись в бд сделки.
              let formdata = check_formdata(req.body.formdata, mycart, res, req.session.userId, req.body.region);
            }
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
