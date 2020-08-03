var express = require('express');
var router = express.Router();
var path = require('path');
const request = require('request');
var config = require('../config');
var {Pool, Client} = require('pg');
//var pgp = require("pg-promise")(/*options*/);
//var db = pgp("postgres://"+config.DB_USER+":"+config.DB_PASSWORD+"@"+config.DB_HOST+":5432/"+config.DB_NAME);

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

var pgPool = new Pool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DBNAME
});

function checkFilters (data){
  var brand_tea = ['greenfield','nuri','tess','java','candy','shah'];
  var tea_type = ['black','black_1','green','green_1','herbal'];
  var teabag = ['20','25','30','50','100'];
  var tea_pack = ['box','package','present'];
  var collection = 'in_one_collection';
  var filters = Object.keys(data);
  var brand_sql = '';
  var tea_type_sql ='';
  var teabag_sql = '';
  var tea_pack_sql = '';
  var final_sql = '';
  console.log('huy');
  for (var each of brand_tea){
    for (var item of filters){
      if (each == item) {
        brand_sql+=`or sort = '${item}' `;
      }
    }
  }
  for (var each of tea_type){
    for (var item of filters){
      if (each == item) {
        tea_type_sql+=`or about = '${item}' `;
      }
    }
  }
  for (var each of teabag){
    for (var item of filters){
      if ('teabag_'+each == item) {
        teabag_sql+=`or tea_bags = '${each}' `;
      }
    }
  }
  for (var each of tea_pack){
    for (var item of filters){
      if (each == item) {
        tea_pack_sql+=`or packaging = '${item}' `;
      }
    }
  }
  for (var item of filters){
    if (collection == item){
      final_sql+=`and in_one_collection = 'true'`;
    }
  }
  brand_sql = brand_sql.slice(2);
  tea_type_sql = tea_type_sql.slice(2);
  teabag_sql = teabag_sql.slice(2);
  tea_pack_sql = tea_pack_sql.slice(2);


  final_sql = (brand_sql? 'and' + brand_sql: '') + (tea_type_sql? 'and' + tea_type_sql : '') + (teabag_sql?  'and' + teabag_sql : '') + (tea_pack_sql? 'and' + tea_pack_sql : '') + (final_sql? final_sql: '');
  return final_sql;
}

function addProduct() {
  db.none('INSERT INTO products(carousel_img, item_name, item_price, type, sort) VALUES(${src}, ${name}, ${price}, ${type}, ${sort})',{
    src: 'store_prods/tea/1/1.jpg',
    name: 'Зеленый чай в пакетиках Greenfield Flying Dragon, 25 шт.',
    price: 358,
    type: 'tea',
    sort: "greenfield"
  });
}


/* GET users listing. */

var getProducts = `SELECT * FROM tea ORDER BY id DESC`;
var getCoffee = `SELECT * FROM products WHERE type='coffee' ORDER BY id DESC`;



router.route('/shop/:type?')
  .get(function(req,res){
    var type = req.params.type;
    if (!type) {
      pgPool.query(getProducts,[], function(err, response){
      if (err) return console.error(err);
      var prods = response.rows;
      res.render('shop.pug', {
        isRegistred: userinfo.user_id,
        products: prods,
        prod_count: prods.length,
        title: 'Фирменный магазин Орими-трэйд',
        });
      });
    }else if(type == 'tea'){
      var sql = checkFilters(req.query);
       var teaFilters = `SELECT * FROM tea WHERE type='tea'`+ (req.query.range_of_price? 'AND item_price < `+req.query.range_of_price+`': '') + (req.query.weight? 'AND weight< `+req.query.weight+`': '') + sql + ` ORDER BY id DESC`;
       console.log(teaFilters);
      pgPool.query(teaFilters,[], function(err, response){
      if (err) return console.error(err);
      var prods = response.rows;
      console.log(prods); //debug
      res.render('shop.pug', {
        isRegistred: req.session.userId,
        products: prods,
        prod_count: prods.length,
        title: 'Фирменный магазин Орими-трэйд',
        type: 'tea',
        });
      });
    }
    else if(type=='coffee'){
      pgPool.query(getCoffee,[], function(err, response){
      if (err) return console.error(err);
      var prods = response.rows;
      console.log(prods); //debug
      res.render('shop.pug', {
        isRegistred: req.session.userId,
        products: prods,
        prod_count: prods.length,
        title: 'Фирменный магазин Орими-трэйд',
        type: 'coffee',
        });
      });
    }
  }).post(function(req,res){
    res.send("POST");
  });

module.exports = router;
