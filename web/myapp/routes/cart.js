var express = require('express');
var router = express.Router();
var path = require('path');
const session = require('express-session');
var bodyParser = require('body-parser')
var config = require('../config');
var bx24_url = config.BX24_URI;
var {Pool, Client} = require('pg');
var request = require('request');

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
  user: USER,
  password: PASSWORD,
  database: DBNAME
});

var serverCart = [];

router.route('/cart')
  .get(function(req,res){
    res.render('cart.pug',{
      isRegistred: req.session.userId
    })
  }).post(function(req,res){
    request(bx24_url+"crm.product.list", function(error, response, body){
      console.log(JSON.parse(body));
      var parsedbody = JSON.parse(body);
      var i = 0;
      var result = []
      for (var w in req.body){
        serverCart[i] = {
          id: w,
          quantity: req.body[w]
        };
        for(var x=0; x<parsedbody.total; x++){
          if (serverCart[i].id == parsedbody.result[x].ID){
            result[i] = {
              id: parsedbody.result[x].ID,
              name: parsedbody.result[x].NAME,
              count: serverCart[i].quantity,
              price: parsedbody.result[x].PRICE,
              desc: parsedbody.result[x].DESCRIPTION,
              img: parsedbody.result[x].PREVIEW_PICTURE.showUrl
            };break;
          }
        }
        i++;
      }
      res.send(result);
    });
  });

  module.exports = router;
