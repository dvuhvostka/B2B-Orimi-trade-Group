var express = require('express');
var router = express.Router();
var path = require('path');
const request = require('request');
var config = require('../config');
var {Pool, Client} = require('pg');
var keywords = require('../keywords')
//var pgp = require("pg-promise")(/*options*/);
// var db = pgp("postgres://"+config.DB_USER+":"+config.DB_PASSWORD+"@"+config.DB_HOST+":5432/"+config.DB_NAME);

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
  user: "s0rax",
  password: "MffdwehqsqAREs228T",
  database: DBNAME
});
function createKeywords(data){
  var keywords_res ='';
  var keys = Object.keys(data);
  var titles = Object.keys(keywords);
  for (let each of keys){
    switch(each){
      case "sort":{
        var names = Object.keys(keywords['sort']);
        for (let item of names){
          if (item == data[each]){
            keywords_res += keywords['sort'][item];
          }
        }
        keywords_res += ', ';
      }
      break;
      case "packaging":{
        var names = Object.keys(keywords['packaging']);
        for (let item of names){
          if (item == data[each]){
            keywords_res += keywords['packaging'][item];
          }
        }
        keywords_res += ', ';

      }
      break;
      case "about":{
        var names = Object.keys(keywords['about']);
        for (let item of names){
          if (item == data[each]){
            keywords_res += keywords['about'][item];
          }
        }
        keywords_res += ', ';

      }
      break;
      case "category":{
        var names = Object.keys(keywords['category']);
        for (let item of names){
          if (item == data[each]){
            keywords_res += keywords['category'][item];
          }
        }
        keywords_res += ', ';

      }
      break;
      case "tea_bags":{
        var names = Object.keys(keywords['tea_bags']);
        for (let item of names){
          if (item == data[each]){
            keywords_res += keywords['tea_bags'][item];
          }
        }

      }
      break;
    }
  }
  console.log(keywords_res);
  return keywords_res;
}
function checkFilters (data){
  var brand_tea = ['greenfield','nuri','tess','java','candy','shah','nila','gita'];
  var tea_type = ['black','black_1','green','green_1','herbal'];
  var teabag = ['0','20','25','30','50','100','120'];
  var tea_pack = ['box','package','present','capsule','soft_pack'];
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
  var coffee_brand = ['jardin','jokey','piazza'];
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


/* GET users listing. */
var getSales = `SELECT * FROM sales ORDER BY id`;

router.route('/shop/:type?')
  .get(function(req,res){
    pgPool.query(getSales,[],function(e,r){
      var type = req.params.type;
      var getTea = `SELECT * FROM tea WHERE type='tea' ` + (req.query.range_of_price? 'AND item_price <= '+req.query.range_of_price : ' ') +`ORDER BY id DESC`;
      var getCoffee = `SELECT * FROM coffee WHERE type='coffee'` + (req.query.range_of_price? 'AND item_price <= '+req.query.range_of_price : ' ') +` ORDER BY id DESC`;
      var getOthers = `SELECT * FROM others WHERE type='other' ` + (req.query.range_of_price? 'AND item_price <= '+req.query.range_of_price : ' ') +`ORDER BY id DESC`;
      var getHoreca = `SELECT * FROM horeca WHERE subtype='horeca'` + (req.query.range_of_price? 'AND item_price <= '+req.query.range_of_price : ' ') +`ORDER BY id DESC`;
      if (!type) {
        pgPool.query(getTea,[], function(err, response){
          pgPool.query(getCoffee,[], function(error, responses){
            pgPool.query(getOthers,[], function(error, responsess){
              pgPool.query(getHoreca,[], function(error, responsesss){
                if (err) return console.error(err);
                var prods_tea = response.rows;
                var prods_coffee = responses.rows;
                var prods_others = responsess.rows;
                var prods_horeca = responsesss.rows;
                var prods_double = prods_tea.concat(prods_coffee);
                var prods_triple = prods_double.concat(prods_others);
                var prods = prods_triple.concat(prods_horeca);
                console.log(JSON.stringify(prods[0]));
                res.status(200).render('shop.pug', {
                  isRegistred: req.session.userId,
                  products: JSON.stringify(prods),
                  prod_count: prods.length,
                  title: 'Фирменный магазин Орими Трэйд',
                  needFooter: true,
                  sales: r.rows,
                  sales_q: r.rows.length,
                  });
              });
            });
          });
        });
      }else if(type == 'tea'){
        if(req.query.id==undefined){
          var sql = checkFilters(req.query);
           var teaFilters = `SELECT * FROM tea WHERE type='tea' ` + (req.query.range_of_price? 'AND item_price <= ' + req.query.range_of_price : ' ') + (req.query.weight? ' AND weight <= '+ req.query.weight : ' ') + sql + ` ORDER BY id DESC`;
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
            products: JSON.stringify(prods),
            prod_count: prods.length,
            title: 'Фирменный магазин Орими Трэйд',
            type: 'tea',
            needFooter: true,
            sales: r.rows,
            sales_q: r.rows.length,
            });
          });
        }else if(req.query.id){
          var gettea = `SELECT * FROM tea WHERE type='tea' AND id='`+req.query.id+`'`;
          pgPool.query(gettea,[], function(err, response){
            if(response.rows.length==0){
              res.redirect('/shop');
            }else{
              var prods = response.rows;
              res.render('product.pug', {
                isRegistred: req.session.userId,
                products: prods,
                prod_count: prods.length,
                title: 'Фирменный магазин Орими Трэйд',
                type: 'tea',
                needFooter: false
                });
            }
          });
        }
    }
      else if(type=='coffee'){
        if(req.query.id==undefined){
          var sql = checkCoffeeFilters(req.query);
          console.log('here ', req.query);
          var coffeeFilters = `SELECT * FROM coffee WHERE type='coffee' ` + (req.query.range_of_price? 'AND item_price <= ' + req.query.range_of_price : ' ') + (req.query.weight? ' AND weight <= '+ req.query.weight : ' ') + sql + ` ORDER BY id DESC`;
          console.log(coffeeFilters);
          pgPool.query(coffeeFilters,[], function(err, response){
            if (err) return console.error(err);
            var prods;
            if(response.rows.length==undefined){
              prods = 0;
            }else{prods = response.rows;}
          console.log(prods); //debug
          res.render('shop.pug', {
            isRegistred: req.session.userId,
            products: JSON.stringify(prods),
            prod_count: prods.length,
            title: 'Фирменный магазин Орими Трэйд',
            type: 'coffee',
            needFooter: true,
            sales: r.rows,
            sales_q: r.rows.length,
          });
        });
      }else if(req.query.id){

        var getcoffee = `SELECT * FROM coffee WHERE type='coffee' AND id='`+req.query.id+`'`;
        pgPool.query(getcoffee,[], function(err, response){
          var prods;
          if(response.rows.length==0){
            res.redirect('/shop');
            prods = 0;
          }else{
            prods = response.rows;
            res.render('product.pug', {
              isRegistred: req.session.userId,
              products: prods,
              prod_count: prods.length,
              title: 'Фирменный магазин Орими Трэйд',
              type: 'tea',
              needFooter: false
              });
          }
        });
      }
    }else if(type=='other'){
      if(req.query.id==undefined){
        var othersFilters = `SELECT * FROM others WHERE type='other' ` + (req.query.range_of_price? 'AND item_price <= '+req.query.range_of_price : ' ') +`ORDER BY id DESC`;;
        pgPool.query(othersFilters,[], function(err, response){
          if (err) return console.error(err);
          var prods;
          if(response.rows==undefined){
            prods = 0;
          }else{prods = response.rows;}
        console.log(prods); //debug
        res.render('shop.pug', {
          isRegistred: req.session.userId,
          products: JSON.stringify(prods),
          prod_count: prods.length,
          title: 'Фирменный магазин Орими Трэйд',
          type: 'other',
          needFooter: true,
          sales: r.rows,
          sales_q: r.rows.length,
        });
      });
    }else if(req.query.id){
      console.log(req.query.id)
      var getothers = `SELECT * FROM others WHERE id='`+req.query.id+`'`;
      pgPool.query(getothers,[], function(err, response){
        var prods;
        if(response.rows.length==0){
          prods = 0;
          res.redirect('/shop');
        }else{
          prods = response.rows;
          res.render('product.pug', {
            isRegistred: req.session.userId,
            products: prods,
            prod_count: prods.length,
            title: 'Фирменный магазин Орими Трэйд',
            type: 'other',
            needFooter: false
            });
        }
      });
    }
  }else if(type=='horeca'){
    if(req.query.id==undefined){
      getHoreca = `SELECT * FROM horeca WHERE `;
      switch('on'){
        case req.query.tea: getHoreca+=`type='tea'`; break;
        case req.query.coffee: getHoreca+=`type='coffee'`; break;
        default: getHoreca = `SELECT * FROM horeca ORDER BY id DESC`; break;
      }
      if((req.query.tea=="on")&&(req.query.coffee=="on")){
        getHoreca = `SELECT * FROM horeca ORDER BY id DESC`;
      }
      pgPool.query(getHoreca,[], function(err, response){
        if (err) return console.error(err);
        var prods;
        if(response.rows==undefined){
          prods = 0;
        }else{prods = response.rows;}
      console.log(prods); //debug
      res.render('shop.pug', {
        isRegistred: req.session.userId,
        products: JSON.stringify(prods),
        prod_count: prods.length,
        title: 'Фирменный магазин Орими Трэйд',
        type: 'horeca',
        needFooter: true,
        sales: r.rows,
        sales_q: r.rows.length,
      });
    });
  }else if(req.query.id){
    console.log(req.query.id)
    var gethoreca = `SELECT * FROM horeca WHERE id='`+req.query.id+`'`;
    pgPool.query(gethoreca,[], function(err, response){
      var prods;
      if(response.rows.length==0){
        prods = 0;
        res.redirect('/shop');
      }else{
        prods = response.rows;
        res.render('product.pug', {
          isRegistred: req.session.userId,
          products: prods,
          prod_count: prods.length,
          title: 'Фирменный магазин Орими Трэйд',
          type: 'horeca',
          needFooter: false
          });
      }
    });
  }
  }
    });
  }).post(function(req,res){
    console.log(req.body);
    if(!req.body.search){
      res.redirect('/shop');
    }else if(req.body.search){

      let xss_pattern = /`|'|"/gim;
      if(req.body.search.match(xss_pattern)){
          console.log('!XSS! from: '+req.ip);
          req.body.search = req.body.search.replace(xss_pattern, " ");
      }
      let search = req.body.search.toLowerCase();
      let getTea = `SELECT * FROM tea WHERE keywords LIKE '%`+search+`%' ORDER BY id DESC`;
      let getCoffee = `SELECT * FROM coffee WHERE keywords LIKE '%`+search+`%' AND type='coffee' ORDER BY id DESC`;
      let getHoreca = `SELECT * FROM horeca WHERE keywords LIKE '%`+search+`%' AND subtype='horeca' ORDER BY id DESC`;

      pgPool.query(getHoreca,[],function(errors,resp){
        pgPool.query(getSales,[],function(e,r){
          pgPool.query(getTea,[], function(err, response){
            pgPool.query(getCoffee,[], function(error, responses){
              if (err) return console.error(err);
              var prods_tea = response.rows;
              var prods_coffee = responses.rows;
              var prods_horeca = resp.rows;
              var prods = prods_tea.concat(prods_coffee).concat(prods_horeca);
              console.log(prods);
              res.render('shop.pug', {
                isRegistred: req.session.userId,
                products: JSON.stringify(prods),
                prod_count: prods.length,
                title: 'Фирменный магазин Орими Трэйд',
                needFooter: true,
                sales: r.rows,
                sales_q: r.rows.length,
              });
            });
          });
        });
      });
    }
  });

module.exports = router;
