var express = require('express');
var router = express.Router();
var path = require('path');
const session = require('express-session');
var bodyParser = require('body-parser')
var config = require('../config');
var pgp = require("pg-promise")(/*options*/);

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

router.route('/deals')
  .get(function(req,res){
    db.one(`SELECT * FROM users WHERE id='`+req.session.userId+`'`).then(function(data){
      if(data.permissions=='mod'){
        res.render('deals.pug', {
          isRegistred: userinfo.user_id,
          title: 'Фирменный магазин Орими-трэйд',
          needFooter: false,
          deals_info: 0
          });
      }else{
        res.redirect('/shop');
      }
    }).catch(function(err){
      res.redirect('/shop');
    });
  }).post(function(req,res){
    db.one(`SELECT * FROM users WHERE id='`+req.session.userId+`'`).then(function(data){
      if(data.permissions=='mod'){
        console.log(req.body);
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
            deals = 0;
          }else{
            for(var i=0; i<deals.length; i++){
              deals[i].delivery_address = deals[i].delivery_address.replace('%2C', ',');
              deals[i].delivery_address = deals[i].delivery_address.replace('%2D', '-');
              deals[i].delivery_address = deals[i].delivery_address.replace('%2E', '.');
              deals[i].delivery_address = deals[i].delivery_address.replace('%2F', '/');
            }
          }
          res.render('deals.pug', {
            isRegistred: userinfo.user_id,
            title: 'Фирменный магазин Орими-трэйд',
            needFooter: false,
            deals_info: deals,
            });
        });
      }else{
        res.redirect('/shop');
      }
    });
  });

module.exports = router;
