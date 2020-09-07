var express = require('express');
var router = express.Router();
var path = require('path');
const session = require('express-session');
var bodyParser = require('body-parser')
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

function createNews(header, intro, body, img) {
  var today = new Date();
  //var time = today.getDate()+"."+today.getMonth()+"."+today.getFullYear();
  //console.log(time);
  var data = {
    date: today,
    header: header,
    body: body,
    img_url: img,
    intro: intro
  }
  var query = "INSERT INTO sales(date, header, body, img_url, intro) VALUES($1,$2,$3,$4,$5)";
  pgPool.query(query, [data.date, data.header, data.body, data.img_url, data.intro], function(err, response){
    if(err) return console.error(err);
  });
}

const urlencodedParser = bodyParser.urlencoded({extended: false});
router.route('/add')
  .get(function(req,res){
    var delQ = "DELETE FROM sales"
    var getUsers = "SELECT * FROM users WHERE id='"+req.session.userId+"'";
    pgPool.query(getUsers, [], function(err, resp){
      if(resp.rows[0]!=undefined){
        if(resp.rows[0].permissions=='mod'){
            pgPool.query(delQ, [], function(err, response){
              if(err) return console.error(err);
          });
        }else{
          console.log('!! /add not allowed : '+resp.rows[0].ip_addr);
        }
      }
    });
    res.send("<script>document.location.href='/sales'</script>");
  }).post(urlencodedParser, function(req,res){
    var getUsers = "SELECT * FROM users WHERE id='"+req.session.userId+"'";
      pgPool.query(getUsers, [], function(err, resp){
        if(resp.rows[0]!=undefined){
          if(resp.rows[0].permissions=='mod'){
            switch(req.body.post_type){
              case 'showattachment': {
                let get_deal_prods_sql = `SELECT * FROM deals WHERE deal_id='`+req.body.deal_id+`'`;
                pgPool.query(get_deal_prods_sql, [], function(err, deals_products_data){
                  res.json(deals_products_data.rows);
                });
                break;
              }
              case 'createnews': createNews(req.body.title, req.body.desc, req.body.body, req.body.img); res.send("ok"); break;
              case 'getItem':
                var item_tea_sql = `SELECT * FROM tea WHERE articul='`+req.body.articul+`'`;
                var item_coffee_sql = `SELECT * FROM coffee WHERE articul='`+req.body.articul+`'`;
                var item_others_sql = `SELECT * FROM others WHERE articul='`+req.body.articul+`'`;
                var item_horeca_sql = `SELECT * FROM horeca WHERE articul='`+req.body.articul+`'`;
                var final_sql = item_tea_sql+" UNION "+item_coffee_sql+" UNION "+item_others_sql+" UNION "+item_horeca_sql+';';
                console.log(final_sql);
                pgPool.query(final_sql, [], function(err,resp){
                  console.log(resp)
                });
              break;
              default: res.send('POST');
            }
            };
          }else{
            console.log('!! /add not allowed : '+resp.rows[0].ip_addr);
          }
        });
  });

  module.exports = router;
