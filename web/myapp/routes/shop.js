var express = require('express');
var router = express.Router();
var path = require('path');
const request = require('request');
var config = require('../config');
var {Pool, Client} = require('pg');
//var pgp = require("pg-promise")(/*options*/);
//var db = pgp("postgres://"+config.DB_USER+":"+config.DB_PASSWORD+"@"+config.DB_HOST+":5432/"+config.DB_NAME);

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

var getProducts = `SELECT * FROM products ORDER BY id DESC`;

/* GET users listing. */
router.route('/shop')
  .get(function(req,res){
      pgPool.query(getProducts,[], function(err, response){
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
