var express = require('express');
var router = express.Router();
var path = require('path');
const session = require('express-session');
var bodyParser = require('body-parser')
var config = require('../config');
var {Pool, Client} = require('pg');
var xlsx = require('xlsx-populate');
const rimraf = require('rimraf');

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
  console.log(sql);
  return sql;
}


const urlencodedParser = bodyParser.urlencoded({extended: false});
router.route('/add')
  .get(function(req,res){
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
              case 'delete_deal': {
                let del_deal_sql_1 = `DELETE FROM deals_info WHERE id='`+req.body.deal_id+`'`;
                let del_deal_sql_2 = `DELETE FROM deals WHERE deal_id='`+req.body.deal_id+`'`;
                db.none(del_deal_sql_1);
                db.none(del_deal_sql_2);
                res.json({
                  ok: true
                });
                break;
              }
              case 'confirm_deal': {
                let del_deal_sql_1 = `UPDATE deals_info SET confirmed=1 WHERE id='`+req.body.deal_id+`'`;
                db.none(del_deal_sql_1);
                res.json({
                  ok: true
                });
                break;
              }
              case 'end_deal': {
                let del_deal_sql_1 = `UPDATE deals_info SET confirmed=2 WHERE id='`+req.body.deal_id+`'`;
                db.none(del_deal_sql_1);
                res.json({
                  ok: true
                });
                break;
              }
              case 'download_deals': {
                //console.log(req.body.city, req.body.time, req.body.confirmed);
                rimraf('./public/xlsx/*', function () {});
                var timeNow = Date.now();
                var time = Date.now() - req.body.time;
                var sql = 0;

                if(req.body.time=='all'){
                  time = 0;
                }

                if(req.body.city=='all'){
                  sql = `SELECT * FROM deals_info WHERE confirmed='`+req.body.confirmed+`' AND (timestamp>`+Number(time)+`)`;
                }else{
                  sql = `SELECT * FROM deals_info WHERE region='`+req.body.city+`' AND confirmed='`+req.body.confirmed+`' AND (timestamp>`+Number(time)+`)`;
                }

                db.any(sql).then(function(deals){
                  if(deals.length == 0){
                    res.json({
                      ok: false
                    });
                  }else{
                    xlsx.fromBlankAsync()
                    .then(workbook => {
                        // Modify the workbook.
                        let counter;
                        let worksheet = workbook.sheet("Sheet1");

                        worksheet.column("A").width(5); //Ширина столбца
                        worksheet.column("B").width(22);
                        worksheet.column("C").width(30);
                        worksheet.column("D").width(50);
                        worksheet.column("E").width(18);
                        worksheet.column("F").width(17);
                        worksheet.column("G").width(17);
                        worksheet.column("H").width(15);
                        worksheet.column("I").width(150);
                        worksheet.cell("A1").value("№");
                        worksheet.cell("B1").value("Дата");
                        worksheet.cell("C1").value("ФИО");
                        worksheet.cell("D1").value("Адрес получения");
                        worksheet.cell("E1").value("Контакты");
                        worksheet.cell("F1").value("Тип оплаты");
                        worksheet.cell("G1").value("Статус");
                        worksheet.cell("H1").value("Итого к оплате");
                        worksheet.cell("I1").value("Товары");

                          db.task(async (t) => {
                                const q1 = new Array();
                                for(var x = 0; x<deals.length; x++){
                                  q1[x] = await t.any("SELECT * FROM deals WHERE deal_id='"+deals[x].id+"'");
                                }
                              return {q1};
                          })
                              .then(data => {
                                for(var i=0; i<deals.length; i++){
                                    deals[i].delivery_address = deals[i].delivery_address.replace('%2C', ',');
                                    deals[i].delivery_address = deals[i].delivery_address.replace('%2D', '-');
                                    deals[i].delivery_address = deals[i].delivery_address.replace('%2E', '.');
                                    deals[i].delivery_address = deals[i].delivery_address.replace('%2F', '/');

                                    let date = deals[i].date.split('.')[0];
                                    let payment_method;
                                    let confirm_status;

                                    switch (deals[i].payment_method) {
                                      case 'nal': payment_method = 'Наличные'; break;
                                      case 'beznal': payment_method = 'Онлайн оплата'; break;
                                      case 'bill': payment_method = 'Выставлен счет'; break;
                                    }

                                    switch (deals[i].confirmed) {
                                      case 0: confirm_status = 'Не подтверждена'; break;
                                      case 1: confirm_status = 'Подтверждена'; break;
                                      case 2: confirm_status = 'Завершена'; break;
                                    }
                                    for (var x=0; x<data.q1[i].length; x++){
                                      counter = worksheet.usedRange().value().length+1;
                                      worksheet.cell("A"+counter).value(deals[i].id);
                                      worksheet.cell("B"+counter).value(date);
                                      worksheet.cell("C"+counter).value(deals[i].second_name_owner+" "+deals[i].first_name_owner+" "+deals[i].third_name_owner);
                                      worksheet.cell("D"+counter).value(deals[i].delivery_address);
                                      worksheet.cell("E"+counter).value(deals[i].owner_contact);
                                      worksheet.cell("F"+counter).value(payment_method);
                                      worksheet.cell("G"+counter).value(confirm_status);
                                      worksheet.cell("H"+counter).value(deals[i].final_price);
                                      worksheet.cell("I"+counter).value(data.q1[i][x].product+", кол-во: "+data.q1[i][x].count+", Цена: "+data.q1[i][x].full_price+", Артикул: "+data.q1[i][x].articul);
                                    }
                                  }
                                  var date = new Date();
                                  var dategetmonth = date.getMonth()+1;
                                  if(dategetmonth<10){
                                    dategetmonth = "0" + dategetmonth.toString();
                                  }
                                  var src = date.getDate()+"."+dategetmonth+"."+date.getFullYear()+"-"+Date.now()+".xlsx";
                                  workbook.toFileAsync("./public/xlsx/"+src);
                                  console.log('Deals downloaded SUCCESS');
                                  res.json({
                                    ok: true,
                                    src: "./xlsx/"+src
                                  })
                              })
                              .catch(error => {
                                  // failure, ROLLBACK was executed
                              });
                    });
                  }
                });
                break;
              }
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
              case "deleteItem": {
                var fprsql = `SELECT item_name, type FROM tea WHERE articul=$1 UNION SELECT item_name, type FROM coffee WHERE articul = $1 UNION SELECT item_name, type FROM others WHERE articul =$1 UNION SELECT item_name, type FROM horeca WHERE articul = $1`;
                db.any(fprsql, req.body.articul).then(function(response){
                  if(response.length){
                    db.none(`DELETE FROM `+response[0].type+` WHERE articul=$1`, req.body.articul);
                    res.json({
                      response
                    });
                  }else{
                    res.json({response: {}});
                  }
                });
                break;
              }
              case 'edit_product': {
                //console.log(JSON.parse(req.body.data));
                let data = JSON.parse(req.body.data);
                console.log(data.sale_price);
                if(data.sale_price){
                  data.sale_price = data.item_price;
                  delete data.item_price;
                } else {
                  data.sale_price = 0;
                }
                console.log(data);
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
              case 'get_org_info': {
                var sql = `SELECT * FROM organizations WHERE owner_id='`+req.body.id+`'`;
                db.any(sql).then((orgs)=> {
                  var sql_user = `SELECT * FROM users WHERE id='`+orgs[0].owner_id+`'`;
                  db.one(sql_user).then((user) => {
                    console.log(orgs);
                    console.log(user);
                    res.json({
                      ok: true,
                      data: orgs[0],
                      user_info: user,
                    });
                  });
                })
                .catch((error)=>{
                  res.json({
                    ok:false,
                    error
                  })
                });
              }
                break;
              case 'delete_org':{
                console.log(req.body);
                var sql = `DELETE from requests_from_organizations where org_id='`+req.body.org_id+`' and id='`+req.body.req_id+`'`;
                db.none(sql).then(()=>{
                  res.json({
                    ok:true,
                  });
                }).catch((error)=>{
                  console.log(error);
                  res.json({
                    ok:false,
                    error
                  });
                });
              }
              break;
              case 'search_firm': {
                var sql = `
                  SELECT * FROM organizations WHERE org_name='`+req.body.value+`' or org_address_ur='`+req.body.value+`' or
                  owner_inn='`+req.body.value+`' or owner_id='`+req.body.value+`' or '`+req.body.value+`' = any(org_address_fact) or
                  owner_sname='`+req.body.value+`' and org_confirmed='1'
                `;
                console.log(sql);
                db.any(sql).then(function(resp){
                  if (resp.length){
                    res.json(resp);
                  }
                  else{
                    res.json('Ничего не найдено')
                  }
                })
                .catch(function(err){
                  res.json({
                    ok: false,
                    err
                  });
                })
              }
                break;
              case 'add_to_sale':{
                var sql = `UPDATE organizations SET stock_access=true WHERE id='`+req.body.id+`'`;
                db.none(sql).then(()=>{
                  res.json({
                    ok:true
                  })
                })
                .catch((err)=>{
                  res.json({
                    ok:false,
                    err
                  })
                })
              }
              default: res.send('POST');
            }
            };
          }else{
            console.log('!! /add not allowed : '+resp.rows[0].ip_addr);
          }
        });
  });

  module.exports = router;
