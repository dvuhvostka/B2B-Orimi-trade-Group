var express = require('express');
var router = express.Router();
var path = require('path');
const request = require('request');
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
  user: USER,
  password: PASSWORD,
  database: DBNAME
});

var getTea = `SELECT * FROM products ORDER BY id DESC`;

router.route('/shop/tea')
  .get(function(req,res){
      pgPool.query(getTea,[], function(err, response){
        if (err) return console.error(err);
        var prods = response.rows;
        console.log(prods); //debug
        res.render('shop.pug', {
          isRegistred: req.session.userId,
          products: prods,
          prod_count: prods.length
        });
      });
  }).post(function(req,res){
    res.send("POST");
  });

module.exports = router;
