var express = require('express');
var router = express.Router();
var path = require('path');
const session = require('express-session');
var config = require('../config');
var {Pool, Client} = require('pg');


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
  user: 's0rax',
  password: 'MffdwehqsqAREs228T',
  database: DBNAME
});


var getNews = `SELECT * FROM sales ORDER BY id`;
/* GET users listing. */
router.get('/sales/:type?', function(req, res) {
  //console.log(req.params.type);
  switch (req.params.type) {
    case 'set':
      if (req.query.id){
        var getSale = `SELECT * FROM sets WHERE set_id='`+req.query.id+`'`;
        db.one(getSale).then((response)=>{
          console.table(response);
          var tea_sql = `select item_name,id,type,sort,articul from tea where`;
          var coffee_sql = `select item_name,id,type,sort,articul from coffee where`;
          var horeca_sql = `select item_name,id,subtype,sort,articul from horeca where`;
          var others_sql = `select item_name,id,type,sort,articul from others where`;

          for(let each of response.products_id){
            tea_sql += ` articul='`+each+`' or`;
            coffee_sql += ` articul='`+each+`' or`;
            horeca_sql += ` articul='`+each+`' or`;
            others_sql += ` articul='`+each+`' or`;
          }
          tea_sql = tea_sql.slice(0,-3);
          coffee_sql = coffee_sql.slice(0,-3);
          horeca_sql = horeca_sql.slice(0,-3);
          others_sql = others_sql.slice(0,-3);
          var final_sql = tea_sql+' union '+coffee_sql+' union '+horeca_sql+' union '+others_sql;
          console.log(final_sql);
          db.any(final_sql).then((r) =>{
            console.log(r);
            res.render('sales.pug',{
              isRegistred: req.session.userId,
              id:req.query.id,
              main: false,
              type: req.params.type,
              title: 'Акционный набор №'+response.set_id,
              saleInfo: response,
              products_info: r,
            });
          });
        });
      } else {
        var getSales = `SELECT * FROM sets ORDER by set_id`;
        db.any(getSales).then((response)=>{
          console.log(response.length);
          res.render('sales.pug',{
            isRegistred: req.session.userId,
            main: true,
            type: req.params.type,
            title: 'Акциионные наборы',
            salesInfo: response,
          });
        });
      }
      break;
    case 'capsule':
      res.render('sales.pug',{
        isRegistred: req.session.userId,
        main: true,
        type: req.params.type,
        title: 'Кофемашина BORK',
      });
      break;
    case 'weekly':
      if(req.query.id){
        var getSale = `SELECT * FROM weekly WHERE weekly_id='`+req.query.id+`'`;
        db.one(getSale).then((response)=>{
          var tea_sql = `select item_name,id,type,sort,articul from tea where`;
          var coffee_sql = `select item_name,id,type,sort,articul from coffee where`;
          var horeca_sql = `select item_name,id,subtype,sort,articul from horeca where`;
          var others_sql = `select item_name,id,type,sort,articul from others where`;

          for(let each of response.products_id){
            tea_sql += ` articul='`+each+`' or`;
            coffee_sql += ` articul='`+each+`' or`;
            horeca_sql += ` articul='`+each+`' or`;
            others_sql += ` articul='`+each+`' or`;
          }
          tea_sql = tea_sql.slice(0,-3);
          coffee_sql = coffee_sql.slice(0,-3);
          horeca_sql = horeca_sql.slice(0,-3);
          others_sql = others_sql.slice(0,-3);
          var final_sql = tea_sql+' union '+coffee_sql+' union '+horeca_sql+' union '+others_sql;
          // console.log(final_sql);
          db.any(final_sql).then((r) =>{
          res.render('sales.pug',{
            isRegistred: req.session.userId,
            id:req.query.id,
            main: false,
            type: req.params.type,
            title: 'Кейс №'+response.weekly_id,
            saleInfo: response,
            products_info: r,
          });
        });
      });
      } else {
        var getSales = `SELECT * FROM weekly ORDER by weekly_id`;
        db.any(getSales).then((response)=>{
          console.log(response);
          res.render('sales.pug',{
            isRegistred: req.session.userId,
            main: true,
            type: req.params.type,
            title: 'Фото полок',
            salesInfo: response,
          });
        });
      }
      break;
      case 'prod': {
        res.render('sales.pug',{
          isRegistred: req.session.userId,
          main: true,
          type: req.params.type,
          title: 'Акция для продавцов',
        });
      }
      break;
    default:
      pgPool.query(getNews,[], function(err, response){
        if (err) return console.error(err);
        var sales = response.rows;
        //console.log(news); //debug
        res.render('sales.pug',{
          isRegistred: req.session.userId,
          pnews: sales,
          news_q: sales.length,
          title: "Акции"
        })
      });
  }
});

module.exports = router;
