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


function check_cart(cart, usr_sets_data) {
  var result = 1;
  var res = {};
  var error;
  var object_product = [];
  for (key in cart){
    //Паттерны регулярных выражений
    var p1 = /tea|coffee|other|horeca|sets/g;
    var p2 = /[^tea|coffee|other|horeca|sets]/g;
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
    }else{
      object_product.push(obj);
      if(product_type=='sets'){
        for(var i =0; i<usr_sets_data.sets.length; i++){
          console.log(usr_sets_data.sets[i]);
          if(usr_sets_data.sets[i].id == product_id){
            if(usr_sets_data.sets[i].rest < product_count){
              if(usr_sets_data.sets[i].rest == 0){
                error = "В этом месяце вы больше не можете приобрести Акционный набор  №"+product_id;
                result = 1;
                res = {
                  ok: false,
                  err: "ERROR_NO_REST",
                  err_txt: error,
                  products: object_product,
                  rest: 0
                }
              }else{
                error = "В этом месяце вам осталось доступно "+usr_sets_data.sets[i].rest+"шт. (Акционный набор №"+product_id+")";
                result = 1;
                res = {
                  ok: false,
                  err: "ERROR_REST",
                  err_txt: error,
                  products: object_product,
                  rest: usr_sets_data.sets[i].rest
                }
              }
            }
          }
        }
      }
    }
  }
  switch (result) {
    case 0: return 0;
    case 1: res.products = object_product; return res;
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
  var dateNow = new Date();
  address = address.replace(/%2C/g, ',');
  address = address.replace('%2D', '-');
  address = address.replace('%2E', '.');
  address = address.replace(/%2F/g, '/');
  var cashback = 0;
  var dategetmonth = dateNow.getMonth()+1;
  var dategetminutes = dateNow.getMinutes();
  if(dategetminutes<10){
    dategetminutes = "0"+dategetminutes.toString();
  }
  if(dategetmonth<10){
    dategetmonth = "0" + dategetmonth.toString();
  }
  var getdatenow = dateNow.getDate()+"."+dategetmonth+"."+dateNow.getFullYear()+" "+dateNow.getHours()+":"+dategetminutes+":"+dateNow.getSeconds();
  if(cart.cashback){
    cashback = cart.cashback;
  }
  console.log(cart.cashback);
  db.none('INSERT INTO deals_info(owner_id, confirmed, date, first_name_owner, second_name_owner, third_name_owner, delivery_address, final_price, payment_method, owner_contact, bonuses, comments, timestamp, region, cashback) VALUES(${owner_id}, ${confirmed}, ${date}, ${first_name_owner}, ${second_name_owner}, ${third_name_owner}, ${delivery_address}, ${final_price}, ${payment_method}, ${owner_contact}, ${bonuses}, ${comments}, ${timestamp}, ${region}, ${cashback})', {
    owner_id: userdata[0].id,
    confirmed: 0,
    date: getdatenow,
    first_name_owner: userdata[0].username,
    second_name_owner: userdata[0].second_name,
    third_name_owner: userdata[0].third_name,
    delivery_address: decodeURI(address),
    final_price: cart.fullcost,
    payment_method: payment,
    owner_contact: userdata[0].number,
    bonuses: Math.floor(bonuses),
    comments: comments,
    timestamp: Date.now(),
    region: region,
    cashback: cashback
  }).then(function(){
      // Записываем товары.
      if(bonuses){
        db.none("UPDATE users SET balance=balance-"+Math.floor(bonuses)+" WHERE id='"+userdata[0].id+"'");
      }
      db.one('SELECT * FROM deals_info WHERE id=(SELECT MAX(id) FROM deals_info)').then(function(deal){
        for (var i = 0; i<cart.products.length; i++){
        db.none('INSERT INTO deals(product, deal_owner, type, count, deal_id, sort, product_id, price_of_one, full_price, subtype, articul, deal_summ) VALUES(${product}, ${deal_owner}, ${type}, ${count}, ${deal_id}, ${sort}, ${product_id}, ${price_of_one}, ${full_price}, ${subtype}, ${articul}, ${deal_summ})',{
            product: cart.products[i].product,
            deal_owner: userdata[0].id,
            type: cart.products[i].type,
            count: cart.products[i].count,
            deal_id: deal.id,
            sort: cart.products[i].sort,
            product_id: cart.products[i].id,
            price_of_one: cart.products[i].price_of_one,
            full_price: cart.products[i].full_price,
            subtype: cart.products[i].subtype,
            articul: cart.products[i].articul,
            deal_summ: cart.fullcost
          }).catch(error=>{
            console.log(error);
          });
        }
        var message = 'Ваш заказ №'+deal.id+' оформлен!';
        res.json({
          ok: true,
          message
        });
      }).catch(error => {
        console.log(error);
        res.json({
          ok:false,
          error
        });
      });
  }).catch(error =>{
    console.log(error);
  });
}

returnCartCost = (data, res, response_type, bonuses, userId, payment_method, region) => {
  if(response_type=="ajax"){
    switch(data.err){
      case "PRODUCT_TYPE_ERROR": {
        var error = "PRODUCT_TYPE_ERROR";
        res.json({
          ok: false,
          error
        });
        break;
      }
      case "ERROR_NO_REST": {
        var fullcost = data.fullcost;
        var error = data.err_txt;
        res.json({
          ok: false,
          error: error,
          fullcost: fullcost,
          rest: 0
        });
        break;
      }
      case "ERROR_REST": {
        var fullcost = data.fullcost;
        var error = data.err_txt;
        res.json({
          ok: false,
          error: error,
          fullcost: fullcost,
          rest: data.rest
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
      var getuserbalance_sql = `SELECT * FROM users WHERE id='`+userId+`'`;

      db.any(getuserbalance_sql).then(function(balance_response){
        if(balance_response[0].balance>=bonuses){
          if(bonuses>data.fullcost){
            var error = "При использовании бонусных баллов, сумма заказа должна оставаться не меньше 2000 руб";
            res.json({
              ok: false,
              error
            });
          }else{
            //Пользователь прошел проверку. У него на балансе достаточно бонусов. Он ввел меньше бонусов, чем стоит товар.
            var min_price = data.fullcost - bonuses;
            if(bonuses<1){
              var error = "Вы не можете использовать меньше 1 бонуса";
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
                  var goodset = [];
                  db.one(`SELECT sets FROM users WHERE id='`+userId+`'`).then(function(usr_sets_data){
                    for (var i = 0; i<data.products.length; i++){
                      if(data.products[i].type=='sets'){
                        for(var x =0; x<usr_sets_data.sets.length; x++){
                          if(usr_sets_data.sets[x].id == data.products[i].id){
                            if(usr_sets_data.sets[x].rest < data.products[i].count){
                              if(usr_sets_data.sets[x].rest == 0){
                                error = "В этом месяце вы больше не можете приобрести Акционный набор  №"+data.products[i].id;
                                var response = {
                                  ok: false,
                                  error: error
                                };
                              }else{
                                error = "В этом месяце вам осталось доступно "+usr_sets_data.sets[x].rest+"шт. (Акционный набор №"+data.products[i].id+")";
                                var response = {
                                  ok: false,
                                  error: error
                                };
                              }
                            }else {
                              goodset.push({id: usr_sets_data.sets[x].id, count: data.products[i].count});
                            }
                          }
                        }
                      }
                    }
                    if(response){
                      res.json(response);
                    }else{
                      var getuserbalance_sql = `SELECT * FROM users WHERE id='`+userId+`'`;
                      db.any(getuserbalance_sql).then(function(balance_response){
                        var userSets = balance_response[0].sets;
                        for (var i = 0; i<goodset.length; i++){
                          for (var x = 0; x < userSets.length; x++){
                            if(goodset[i].id==userSets[x].id){
                              userSets[x].rest -= goodset[i].count;
                            }
                          }
                        }
                        userSets = "'"+JSON.stringify(userSets)+"'";
                        db.none(`UPDATE users SET sets=`+userSets+`WHERE id='`+userId+`'`);
                        add_deal_with_bonuses(data, payment_method, balance_response, Math.floor(bonuses), res, region);
                        console.log('!SUCCESS!');
                        });
                      }
                    });
                }else{
                  var error = "Минимальная сумма заказа 2000 руб.";
                  res.json({
                    ok: false,
                    error
                  });
                }
              }else{
                var error = "Введено неверное значение в поле бонусных баллов";
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
          var goodset = [];
          db.one(`SELECT sets FROM users WHERE id='`+userId+`'`).then(function(usr_sets_data){
            for (var i = 0; i<data.products.length; i++){
              if(data.products[i].type=='sets'){
                for(var x =0; x<usr_sets_data.sets.length; x++){
                  if(usr_sets_data.sets[x].id == data.products[i].id){
                    if(usr_sets_data.sets[x].rest < data.products[i].count){
                      if(usr_sets_data.sets[x].rest == 0){
                        error = "В этом месяце вы больше не можете приобрести Акционный набор  №"+data.products[i].id;
                        var response = {
                          ok: false,
                          error: error
                        };
                      }else{
                        error = "В этом месяце вам осталось доступно "+usr_sets_data.sets[x].rest+"шт. (Акционный набор №"+data.products[i].id+")";
                        var response = {
                          ok: false,
                          error: error
                        };
                      }
                    }else {
                      goodset.push({id: usr_sets_data.sets[x].id, count: data.products[i].count});
                    }
                  }
                }
              }
            }
            if(response){
              res.json(response);
            }else{
              var getuserbalance_sql = `SELECT * FROM users WHERE id='`+userId+`'`;
              db.any(getuserbalance_sql).then(function(balance_response){
                console.log(goodset);
                var userSets = balance_response[0].sets;
                for (var i = 0; i<goodset.length; i++){
                  for (var x = 0; x < userSets.length; x++){
                    if(goodset[i].id==userSets[x].id){
                      userSets[x].rest -= goodset[i].count;
                    }
                  }
                }
                userSets = "'"+JSON.stringify(userSets)+"'";
                db.none(`UPDATE users SET sets=`+userSets+`WHERE id='`+userId+`'`);
                add_deal_with_bonuses(data, payment_method, balance_response, 0, res, region);
                console.log('!SUCCESS!');
              });
            }
          });
        }else{
          var error = "Минимальная сумма заказа 2000 руб.";
          res.json({
            ok: false,
            error
          });
        }
  }
}

get_cart_cost = (cart, res, response_type, bonuses, userId, payment_method, region) => {
  switch(cart) {
    case 0: console.log('PRODUCT_TYPE_ERROR');
    default: {
      //Если полученный объект с данными корзины не пустой:
        //console.log(cart);
        var tea_sql = `SELECT * FROM tea WHERE id=0`;
        var coffee_sql = `SELECT * FROM coffee WHERE id=0`;
        var horeca_sql = `SELECT * FROM horeca WHERE id=0`;
        var other_sql = `SELECT * FROM others WHERE id=0`;
        var sets_sql = `SELECT * FROM sets WHERE set_id=0`;

        for (var i=0; i<cart.products.length; i++){
          switch(cart.products[i].type){
            case "tea":{
              tea_sql += ` OR id=`+cart.products[i].id;
              break;
            }
            case "coffee":{
              coffee_sql += ` OR id=`+cart.products[i].id;
              break;
            }
            case "horeca": {
              horeca_sql += ` OR id=`+cart.products[i].id;
              break;
            }
            case "other": {
              other_sql += ` OR id=`+cart.products[i].id;
              break;
            }
            case "sets": {
              sets_sql += ` OR set_id=`+cart.products[i].id;
              break;
            }
            default: {
              returnCartCost(cart, res, response_type, userId, payment_method, region);
              break;
            }
          }
        }
        db.task(async (t) => {
            let tea= await t.any(tea_sql);
            let coffee= await t.any(coffee_sql);
            let horeca= await t.any(horeca_sql);
            let others= await t.any(other_sql);
            let sets= await t.any(sets_sql);
            return {tea,coffee,horeca,others,sets};
        })
           .then(data => {
              var fullcost = 0;
              var cashback = 0;
               for(var i=0; i<cart.products.length; i++){
                 switch(cart.products[i].type){
                   case "tea":{
                      for(var x=0; x<data.tea.length; x++){
                        if(data.tea[x].id==cart.products[i].id){
                          var price = data.tea[x].item_price;
                          if (data.tea[x].sale_price!=0) price = data.tea[x].sale_price;
                          cart.products[i].price_of_one = price;
                          cart.products[i].full_price = Math.ceil((price*cart.products[i].count)*100)/100;
                          cart.products[i].sort = data.tea[x].sort;
                          cart.products[i].product = data.tea[x].item_name;
                          cart.products[i].subtype = 0;
                          cart.products[i].articul = data.tea[x].articul;
                          fullcost += cart.products[i].full_price;
                        }
                      }
                      break;
                   }
                   case "coffee":{
                     for(var x=0; x<data.coffee.length; x++){
                       if(data.coffee[x].id==cart.products[i].id){
                         var price = data.coffee[x].item_price;
                         if (data.coffee[x].sale_price!=0) price = data.coffee[x].sale_price;
                         cart.products[i].price_of_one = price;
                         cart.products[i].full_price = Math.ceil((price*cart.products[i].count)*100)/100;
                         cart.products[i].sort = data.coffee[x].sort;
                         cart.products[i].product = data.coffee[x].item_name;
                         cart.products[i].subtype = 0;
                         cart.products[i].articul = data.coffee[x].articul;
                         fullcost += cart.products[i].full_price;
                       }
                     }
                     break;
                   }
                   case "horeca": {
                     for(var x=0; x<data.horeca.length; x++){
                       if(data.horeca[x].id==cart.products[i].id){
                         var price = data.horeca[x].item_price;
                         if (data.horeca[x].sale_price!=0) price = data.horeca[x].sale_price;
                         cart.products[i].type = data.horeca[x].type;
                         cart.products[i].price_of_one = price;
                         cart.products[i].full_price = Math.ceil((price*cart.products[i].count)*100)/100;
                         cart.products[i].sort = data.horeca[x].sort;
                         cart.products[i].product = data.horeca[x].item_name;
                         cart.products[i].subtype = 'horeca';
                         cart.products[i].articul = data.horeca[x].articul;
                         fullcost += cart.products[i].full_price;
                       }
                     }
                     break;
                   }
                   case "other": {
                     for(var x=0; x<data.others.length; x++){
                       if(data.others[x].id==cart.products[i].id){
                         var price = data.others[x].item_price;
                         if (data.others[x].sale_price!=0) price = data.others[x].sale_price;
                         cart.products[i].price_of_one = price;
                         cart.products[i].full_price = Math.ceil((price*cart.products[i].count)*100)/100;
                         cart.products[i].product = data.others[x].item_name;
                         cart.products[i].subtype = 0;
                         cart.products[i].sort = data.others[x].sort;
                         cart.products[i].articul = data.others[x].articul;
                         fullcost += cart.products[i].full_price;
                       }
                     }
                     break;
                   }
                   case "sets": {
                     for(var x=0; x<data.sets.length; x++){
                       if(data.sets[x].set_id==cart.products[i].id){
                         console.log(data.sets[x].cashback);
                         var price = data.sets[x].set_price;
                         cart.products[i].price_of_one = price;
                         cart.products[i].full_price = Math.ceil((price*cart.products[i].count)*100)/100;
                         cart.products[i].product = data.sets[x].item_name;
                         cart.products[i].subtype = 0;
                         cart.products[i].sort = 'sets';
                         cart.products[i].articul = 0;
                         cashback += cart.products[i].full_price/100*data.sets[x].cashback;
                         fullcost += cart.products[i].full_price;
                       }
                     }
                     break;
                   }
                   default: {
                     returnCartCost(cart, res, response_type, Math.floor(bonuses), userId, payment_method, region);
                     break;
                   }
                 }
               }
               cart.cashback = Math.round(cashback);
               cart.fullcost = Math.ceil((fullcost)*100)/100;
               console.log(cart);
               returnCartCost(cart, res, response_type, Math.floor(bonuses), userId, payment_method, region); //Передаем обновленную и пересчитанную корзину на вывод
           })
            .catch(error => {
              console.log(error);
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
    var sql=`SELECT * FROM organizations WHERE owner_id='`+req.session.userId+`'`;
    db.one(sql).then((org_info)=>{
      console.log(org_info.org_address_fact);
      res.render('order.pug', {
        org: org_info,
        isRegistred: userinfo.user_id,
        title: 'Фирменный магазин Орими-трэйд',
        needFooter: false,
      });
    }).catch((err)=>{
      console.log(err);
      res.render('order.pug', {
        err: err,
        isRegistred: userinfo.user_id,
        title: 'Фирменный магазин Орими-трэйд',
        needFooter: false,
      });
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
            db.one(`SELECT sets FROM users WHERE id='`+req.session.userId+`'`).then(function(usr_sets_data){
              var cart = JSON.parse(req.body.cart); // Получаем корзину
              var mycart = check_cart(cart, usr_sets_data); // Парсим и проверяем корзину
              get_cart_cost(mycart, res, "ajax", 0, req.session.userId, req.body.region);
            });
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
          console.log(req.body);
          if(req.body.cart!=''){
            db.one(`SELECT sets FROM users WHERE id='`+req.session.userId+`'`).then(function(usr_sets_data){
              var cart = JSON.parse(req.body.cart);
              var mycart = check_cart(cart, usr_sets_data); //Проверка корзины
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
            });
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
