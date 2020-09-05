var express = require('express');
var router = express.Router();
var path = require('path');
const session = require('express-session');
var bodyParser = require('body-parser')
var config = require('../config');
//var {Pool, Client} = require('pg');
var request = require('request');
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
var db_cart = pgp("postgres://"+config.DB_USER+":"+config.DB_PASSWORD+"@"+HOST+":5432/"+config.DB_NAME);


var serverCart = [];

router.route('/cart')
  .get(function(req, res) {
    res.render('cart.pug', {
      isRegistred: req.session.userId,
      title: 'Корзина'
    })
  }).post(function(req, res) {
    console.log(req.body)
    var sql_tea_result = "SELECT * FROM tea WHERE id=0 "
    var sql_coffee_result = "SELECT * FROM coffee WHERE id=0"
    var sql_others_result = "SELECT * FROM others WHERE id=0"
    var sql_horeca_result = "SELECT * FROM horeca WHERE id=0"

    var pattern = /tea|coffee|other|horeca/g;
    var sql_tea = [];
    var sql_coffee = [];
    var sql_others = [];
    var sql_horeca = [];
    for (key in req.body) {
      if (key.match(pattern)[0] == 'tea') {
        var id = key.replace(pattern, "");
          sql_tea.push("OR id='" + id + "' ");
          sql_tea_result = sql_tea_result + "OR id='" + id + "' ";
      } else if (key.match(pattern)[0] == 'coffee') {
        var id = key.replace(pattern, "");
          sql_coffee.push("OR id='" + id + "' ");
          sql_coffee_result = sql_coffee_result + "OR id='" + id + "' ";
      }else if (key.match(pattern)[0] == 'other'){
        var id = key.replace(pattern, "");
          sql_others.push("OR id='" + id + "' ");
          sql_others_result = sql_others_result + "OR id='" + id + "' ";
      }else if (key.match(pattern)[0] == 'horeca'){
        var id = key.replace(pattern, "");
          sql_horeca.push("OR id='" + id + "' ");
          sql_horeca_result = sql_horeca_result + "OR id='" + id + "' ";
      }
    }

    var products_data = {
      tea: {},
      coffee: {},
      other: {}
    }

    if ((sql_coffee.length == 0) && (sql_tea.length == 0) && (sql_others.length == 0) && (sql_horeca.length == 0)) {
      res.send("POST");
    } else if ((sql_coffee.length != 0) || (sql_tea.length != 0) || (sql_others.length!=0) || (sql_horeca.length!=0)) {
      db_cart.any(sql_coffee_result).then(function(data) {
        db_cart.any(sql_tea_result).then(function(data2) {
          db_cart.any(sql_others_result).then(function(data3) {
            db_cart.any(sql_horeca_result).then(function(data4) {
                if (data) {
                  products_data.coffee = data;
                }
                if (data2) {
                  products_data.tea = data2;
                }
                if (data3) {
                  products_data.other = data3;
                }
                if (data4) {
                  products_data.horeca = data4;
                }
                res.send(products_data);
              });
            });
          });
      }).catch(error => {
        console.log('ERROR:', error);
      });
    }
  });

module.exports = router;
