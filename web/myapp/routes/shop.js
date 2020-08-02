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

function addProduct() {
  db.none('INSERT INTO products(carousel_img, item_name, item_price, type, sort) VALUES(${src}, ${name}, ${price}, ${type}, ${sort})',{
    src: 'store_prods/tea/1/1.jpg',
    name: 'Зеленый чай в пакетиках Greenfield Flying Dragon, 25 шт.',
    price: 358,
    type: 'tea',
    sort: "greenfield"
  });
}

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
