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

function updateItemSql(data){
  //UPDATE users SET link_code='' WHERE id='"+req.session.userId+"'"
  var sql = `SET `;
  var data_s = Object.entries(data);
  for(let each of data_s){
    var key = each[0];
    var value = each[1];
    if(key!='id')
      sql += key+`=`+`'`+value+`'`+`, `;
  }
  sql = sql.slice(0,-2);
  return sql;
}


const urlencodedParser = bodyParser.urlencoded({extended: false});
router.route('/add')
  .get(function(req,res){
    var delQ = "DELETE FROM sales WHERE id=(SELECT MAX(id) FROM sales)"
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
              var item_sql_tea = `SELECT * FROM tea WHERE articul=$1`;
              var item_sql_coffee = `SELECT * FROM coffee WHERE articul=$1`;
              var item_sql_other = `SELECT * FROM others WHERE articul=$1`;
              var item_sql_horeca = `SELECT * FROM horeca WHERE articul=$1`;
                db.any(item_sql_tea, req.body.articul)
                .then(function(response){
                  if(response.length)
                    res.json({
                      response
                    })
                })
                db.any(item_sql_coffee, req.body.articul)
                .then(function(response){
                  if(response.length)
                    res.json({
                      response
                    })
                })
                db.any(item_sql_other, req.body.articul)
                .then(function(response){
                  if(response.length)
                    res.json({
                      response
                    })
                  //console.log(res.headersSent);
                })
                db.any(item_sql_horeca, req.body.articul)
                .then(function(response){
                  if(response.length)
                    res.json({
                      response
                    })
                })
                setTimeout(()=>{
                  if(!res.headersSent)
                    res.json({
                      response: {}
                    });
                },1000);
              break;
              case 'edit_product': {
                console.log(JSON.parse(req.body.data));
                let data = JSON.parse(req.body.data);
                if(data.sale_price){
                  data.sale_price = data.item_price;
                  delete data.item_price;
                }
                let sql;
                let add_sql = updateItemSql(data);
                if(!data.subtype){
                  switch (data.type) {
                    case 'tea':
                      sql = `UPDATE tea `;
                      sql += add_sql;
                      sql += ` WHERE id=`+data.id;
                      db.none(sql).then(()=>{
                        console.log('ok');
                        res.json('Изменения сохранены!');
                      })
                      break;
                    case 'coffee':
                      sql = `UPDATE coffee `;
                      sql += add_sql;
                      sql += ` WHERE id=`+data.id;
                      db.none(sql).then(()=>{
                        console.log('ok');
                        res.json('Изменения сохранены!');
                      })
                      break;
                    case 'other':
                      sql = `UPDATE others `;
                      sql += add_sql;
                      sql += ` WHERE id=`+data.id;
                      db.none(sql).then(()=>{
                        console.log('ok');
                        res.json('Изменения сохранены!');
                      })
                      break;
                    default:

                  }
                } else {
                  sql = `UPDATE horeca `;
                  sql += add_sql;
                  sql += ` WHERE id=`+data.id;
                  console.log(sql);
                  db.none(sql).then(()=>{
                    console.log('ok');
                    res.json('Изменения сохранены!');
                  })
                }
              } break;
              default: res.send('POST');
            }
            };
          }else{
            console.log('!! /add not allowed : '+resp.rows[0].ip_addr);
          }
        });
  });

  module.exports = router;
