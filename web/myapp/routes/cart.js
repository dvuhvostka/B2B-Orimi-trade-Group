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
  .get(function(req,res){
    res.render('cart.pug',{
      isRegistred: req.session.userId
    })
  }).post(function(req,res){

    var sql_tea_result = "SELECT * FROM tea WHERE "
    var sql_coffee_result = "SELECT * FROM coffee WHERE "

    var pattern = /tea|coffee/g;
    var sql_tea = [];
    var sql_coffee = [];
    for (key in req.body){
      if(key.match(pattern)[0]=='tea'){
        var id = key.replace(pattern, "");
        if (sql_tea.length == 0){
          sql_tea.push("OR id='"+id+"' ");
          sql_tea_result = sql_tea_result + "id='"+id+"' ";
        }else{
          sql_tea.push("OR id='"+id+"' ");
          sql_tea_result = sql_tea_result + "OR id='"+id+"' ";
        }
      }else if(key.match(pattern)[0]=='coffee'){
        var id = key.replace(pattern, "");
        if (sql_coffee.length == 0){
          sql_coffee.push("id='"+id+"' ");
          sql_coffee_result = sql_coffee_result + "id='"+id+"' ";
        }else{
          sql_coffee.push("OR id='"+id+"' ");
          sql_coffee_result = sql_coffee_result +"OR id='"+id+"' ";
        }
      }
    }

var products_data = {
  tea: {},
  coffee: {}
}

  if ((sql_coffee.length == 0)&&(sql_tea.length == 0)){
    res.send("POST");
  }else if((sql_coffee.length != 0)&&(sql_tea.length != 0)){
    db_cart.any(sql_coffee_result).then(function (data) {
      db_cart.any(sql_tea_result).then(function (data_2) {
        if(data){products_data.coffee = data;}
        if(data_2){products_data.tea = data_2;}
        res.send(products_data);
      }).catch(error => {
       console.log('ERROR:', error);
     });
    }).catch(error => {
     console.log('ERROR:', error);
   });
 } else if(sql_coffee.length != 0){
   db_cart.any(sql_coffee_result).then(function (data) {
     if(data){products_data.coffee = data;}
     res.send(products_data);
   }).catch(error => {
    console.log('ERROR:', error);
  });
} else if (sql_tea.length != 0){
  db_cart.any(sql_tea_result).then(function (data) {
    if(data){products_data.tea = data;}
    res.send(products_data);
  }).catch(error => {
   console.log('ERROR:', error);
 });
}
  });

  module.exports = router;
