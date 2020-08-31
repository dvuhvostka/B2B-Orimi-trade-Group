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
  user: "postgres",
  password: "12345",
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

function checkCoffeeFilters (data){
  var coffee_brand = ['Jardin','Jokey','Piazza'];
  var coffee_type = ['milled','milled_2','cereal','cereal_2','cereal_3', 'cereal_4', 'sublem', 'granul'];
  var coffee_pack = ['glass_jar','can','soft_pack', 'capsule'];
  var filters = Object.keys(data);
  var coffee_brand_sql = '';
  var coffee_type_sql ='';
  var coffee_pack_sql = '';
  var final_sql = '';
  for (var each of  coffee_brand){
    for (var item of filters){
      if (each == item) {
        coffee_brand_sql+=`or sort = '${item}' `;
      }
    }
  }
  for (var each of coffee_type){
    for (var item of filters){
      if (item == 'cereal'){
        coffee_type_sql+=`or category = 'cereal_2' or category = 'cereal_3' or category = 'cereal_4' `;
      }else if (each == item) {
        coffee_type_sql+=`or category = '${item}' `;
      }
    }
  }
  for (var each of coffee_pack){
    for (var item of filters){
      if (each == item) {
        coffee_pack_sql+=`or packaging = '${item}' `;
      }
    }
  }
  coffee_brand_sql = coffee_brand_sql.slice(2);
  coffee_type_sql = coffee_type_sql.slice(2);
  coffee_pack_sql = coffee_pack_sql.slice(2);


  final_sql = (coffee_brand_sql? 'and' + coffee_brand_sql: '') + (coffee_type_sql? 'and' + coffee_type_sql : '') + (coffee_pack_sql? 'and' + coffee_pack_sql : '') + (final_sql? final_sql: '');
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

var getTea = `SELECT * FROM tea ORDER BY id DESC`;
var getCoffee = `SELECT * FROM coffee WHERE type='coffee' ORDER BY id DESC`;



router.route('/shop/:type?')
  .get(function(req,res){
    console.log("\n\nshop\n\n");
    var type = req.params.type;
    if (!type) {
      pgPool.query(getTea,[], function(err, response){
        pgPool.query(getCoffee,[], function(error, responses){
          if (err) return console.error(err);
          var prods_tea = response.rows;
          var prods_coffee = responses.rows;
          var prods = prods_tea.concat(prods_coffee);
          // console.log(prods);
          res.render('shop.pug', {
            isRegistred: userinfo.user_id,
            products: prods,
            prod_count: prods.length,
            title: 'Фирменный магазин Орими-трэйд',
            needFooter: true
            });
        });
      });
    }else if(type == 'tea'){
      if(req.query.id==undefined){
        var sql = checkFilters(req.query);
        console.log('here ', req.query);
         var teaFilters = `SELECT * FROM tea WHERE type='tea' ` + (req.query.range_of_price? 'AND item_price < ' + req.query.range_of_price : ' ') + (req.query.weight? ' AND weight < '+ req.query.weight : ' ') + sql + ` ORDER BY id DESC`;
         console.log(teaFilters);
        pgPool.query(teaFilters,[], function(err, response){
        if (err) return console.log(err);
        var prods;
        if(response.rows==undefined){
          prods = 0;
        }else{
          prods = response.rows;
        }
        res.render('shop.pug', {
          isRegistred: req.session.userId,
          products: prods,
          prod_count: prods.length,
          title: 'Фирменный магазин Орими-трэйд',
          type: 'tea',
          needFooter: true
          });
        });
      }else if(req.query.id){
        var gettea = `SELECT * FROM tea WHERE type='tea' AND id='`+req.query.id+`'`;
        pgPool.query(gettea,[], function(err, response){
          var prods = response.rows;
          res.render('product.pug', {
            isRegistred: req.session.userId,
            products: prods,
            prod_count: prods.length,
            title: 'Фирменный магазин Орими-трэйд',
            type: 'tea',
            needFooter: false
            });
        });
      }
  }
    else if(type=='coffee'){
      if(req.query.id==undefined){
        var sql = checkCoffeeFilters(req.query);
        console.log('here ', req.query);
        var coffeeFilters = `SELECT * FROM coffee WHERE type='coffee' ` + (req.query.range_of_price? 'AND item_price < ' + req.query.range_of_price : ' ') + sql + ` ORDER BY id DESC`;
        console.log(coffeeFilters);
        pgPool.query(coffeeFilters,[], function(err, response){
          if (err) return console.error(err);
          var prods;
          if(response.rows==undefined){
            prods = 0;
          }else{prods = response.rows;}
        console.log(prods); //debug
        res.render('shop.pug', {
          isRegistred: req.session.userId,
          products: prods,
          prod_count: prods.length,
          title: 'Фирменный магазин Орими-трэйд',
          type: 'coffee',
          needFooter: true
        });
      });
    }else if(req.query.id){
      console.log(req.query.id)
      var getcoffee = `SELECT * FROM coffee WHERE type='coffee' AND id='`+req.query.id+`'`;
      pgPool.query(getcoffee,[], function(err, response){
        var prods;
        if(response.rows==undefined){
          prods = 0;
        }else{prods = response.rows;}
        res.render('product.pug', {
          isRegistred: req.session.userId,
          products: prods,
          prod_count: prods.length,
          title: 'Фирменный магазин Орими-трэйд',
          type: 'tea',
          needFooter: false
          });
      });
      }
    }
  }).post(function(req,res){
    console.log(req.body);
    if(!req.body.search){
      res.redirect('/shop');
    }else if(req.body.search){
      let pattern = {
        greenfield: /greenfield|гринфилд/gi,
        tess: /\btess|тэс|tes|тес/gi,
        java: /java|ява|Принцесса ява/gi,
        nuri: /nuri|нури|Принцесса нури/gi,
        candy: /candy|канди|кэнди|Принцесса канди/gi,
        shah: /шах/gi,
        jockey: /жакей|жокей|jockey|jokey/gi,
        jardin: /жардин|jardin/gi,
        piazza: /пиаза|piazza/g,
        ceylon: /цейлон|ceylon/gi,
        arabica: /arabica|арабика/gi,
        milky: /молочный|с молоком|milky/gi,
        melissa: /мелиса|мелисса|melissa|melisa/gi,
        tea: /чай/gi
      }

      let xss_pattern = /`|'|"/gim;

      let find = undefined;

      if(req.body.search.match(xss_pattern)){
          console.log('!XSS! from: '+req.ip);
          req.body.search = req.body.search.replace(xss_pattern, " ");
      }

      if(req.body.search.match(pattern.greenfield)){
          console.log(1);
          req.body.search = req.body.search.replace(pattern.greenfield, "Greenfield");
      }

      if(req.body.search.match(pattern.tess)){
          console.log(2);
          req.body.search = req.body.search.replace(pattern.tess, "Tess");
      }

      if(req.body.search.match(pattern.java)){
          console.log(3);
          req.body.search = req.body.search.replace(pattern.java, "Ява");
      }

      if(req.body.search.match(pattern.nuri)){
          console.log(4);
          req.body.search = req.body.search.replace(pattern.nuri, "Нури");
      }

      if(req.body.search.match(pattern.candy)){
          console.log(5);
          req.body.search = req.body.search.replace(pattern.candy, "Канди");
      }

      if(req.body.search.match(pattern.jockey)){
          console.log(6);
          req.body.search = req.body.search.replace(pattern.jockey, "Жокей");
      }

      if(req.body.search.match(pattern.jadrin)){
          req.body.search = req.body.search.replace(pattern.jardin, "Jardin");
      }

      if(req.body.search.match(pattern.piazza)){
        req.body.search = req.body.search.replace(pattern.piazza, "Piazza del Caffe");
      }

      if(req.body.search.match(pattern.ceylon)){
        req.body.search = req.body.search.replace(pattern.ceylon, "Ceylon");
      }

      if(req.body.search.match(pattern.arabica)){
        req.body.search = req.body.search.replace(pattern.arabica, "Arabica");
      }

      if(req.body.search.match(pattern.milky)){
        req.body.search = req.body.search.replace(pattern.milky, "Milky");
      }

      if(req.body.search.match(pattern.melissa)){
        req.body.search = req.body.search.replace(pattern.melissa, "Melissa");
      }

      if(req.body.search.match(pattern.tea)){
        req.body.search = req.body.search.replace(pattern.tea, "Чай");
      }

      console.log(req.body.search);

      let getTea = `SELECT * FROM tea WHERE item_name LIKE '%`+req.body.search+`%' ORDER BY id DESC`;
      let getCoffee = `SELECT * FROM coffee WHERE item_name LIKE '%`+req.body.search+`%' AND type='coffee' ORDER BY id DESC`;


      pgPool.query(getTea,[], function(err, response){
        pgPool.query(getCoffee,[], function(error, responses){
          if (err) return console.error(err);
          var prods_tea = response.rows;
          var prods_coffee = responses.rows;
          var prods = prods_tea.concat(prods_coffee);
          console.log(prods);
          res.render('shop.pug', {
            isRegistred: userinfo.user_id,
            products: prods,
            prod_count: prods.length,
            title: 'Фирменный магазин Орими-трэйд',
            needFooter: true
            });
        });
      });
    }
  });


router.route('/shop/products')
  .get(function(req,res){
    res.send('FUCK YOU');
  });

module.exports = router;
