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
  user: 'z0rax',
  password: '12345',
  database: DBNAME
});

function getSaleItems(articul) {
  var item_sql_tea = `SELECT * FROM tea WHERE item_name=$1`;
  var item_sql_coffee = `SELECT * FROM coffee WHERE item_name=$1`;
  var item_sql_other = `SELECT * FROM others WHERE item_name=$1`;
  var item_sql_horeca = `SELECT * FROM horeca WHERE item_name=$1`;
    db.any(item_sql_tea, articul)
    .then(function(response){
      if(response.length)
        res.json({
          response
        })
    })
    .catch(function(e) {
      console.log(e);
    })
    db.any(item_sql_coffee, articul)
    .then(function(response){
      return response;
    })
    .catch(function(e) {
      console.log(e);
    })
    db.any(item_sql_other, articul)
    .then(function(response){
      if(response.length)
        res.json({
          response
        })
      //console.log(res.headersSent);
    })
    .catch(function(e) {
      console.log(e);
    })
    db.any(item_sql_horeca, articul)
    .then(function(response){
      if(response.length)
        res.json({
          response
        })
    })
    .catch(function(e) {
      console.log(e);
    })
}


var getNews = `SELECT * FROM sales ORDER BY id DESC`;
/* GET users listing. */
router.get('/sales/:type?', function(req, res) {
  //console.log(req.params.type);
  switch (req.params.type) {
    case 'set':
      if (req.query.id){
        //console.log(123123);
        var getSale = `SELECT * FROM sets WHERE set_id='`+req.query.id+`'`;
        db.one(getSale).then((response)=>{
        //  console.log(response);
          var getItems = new Promise(function(resolve,reject){
              var item;
              for(let each of response.products_id){
              item += getSaleItems(each);
            }
            resolve(item)
          });
          getItems.then((r) =>{
            console.log(r);
          })
          res.render('sales.pug',{
            isRegistred: req.session.userId,
            main: false,
            type: req.params.type,
            title: 'Акции',
            saleInfo: response,
          });
        });
      } else {
        var getSales = `SELECT * FROM sets`;
        db.any(getSales).then((response)=>{
          res.render('sales.pug',{
            isRegistred: req.session.userId,
            main: true,
            type: req.param.type,
            title: 'Акции',
            salesInfo: response,
          });
        });
      }
      break;
    case 'capsule':
      if(req.query.id){
        var getSale = `SELECT * FROM sets WHERE set_id='`+req.query.id+`'`;
        db.one(getSale).then((response)=>{
          res.render('sales.pug',{
            isRegistred: req.session.userId,
            main: false,
            type: req.param.type,
            title: 'Акции',
            saleInfo: response,
          });
        });
      } else {
        var getSales = `SELECT * FROM sets`;
        db.any(getSales).then((response)=>{
          res.render('sales.pug',{
            isRegistred: req.session.userId,
            main: true,
            type: req.param.type,
            title: 'Акции',
            salesInfo: response,
          });
        });
      }
      break;
    case 'weekly':
      if(req.query.id){
        var getSale = `SELECT * FROM weekly_sales WHERE set_id='`+req.query.id+`'`;
        db.one(getSale).then((response)=>{
          res.render('sales.pug',{
            isRegistred: req.session.userId,
            main: false,
            type: req.param.type,
            title: 'Акции',
            saleInfo: response,
          });
        });
      } else {
        var getSales = `SELECT * FROM weekly_sales`;
        db.any(getSales).then((response)=>{
          res.render('sales.pug',{
            isRegistred: req.session.userId,
            main: true,
            type: req.param.type,
            title: 'Акции',
            salesInfo: response,
          });
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
