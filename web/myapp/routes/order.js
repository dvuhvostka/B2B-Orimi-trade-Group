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

var db = pgp("postgres://"+config.DB_USER+":"+config.DB_PASSWORD+"@"+HOST+":5432/"+config.DB_NAME);

router.route('/order')
  .get(function(req,res){
    res.render('order.pug', {
      isRegistred: userinfo.user_id,
      title: 'Фирменный магазин Орими-трэйд',
      needFooter: false,
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
        }
        break;
        case "delivery_info": {
          console.log(req.body);
          break;
        }
        default: {
          console.log(req.body);
          res.send("POST"); break;
        }
      }
    }
  });

module.exports = router;
