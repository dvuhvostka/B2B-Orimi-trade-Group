var express = require('express');
var router = express.Router();
var path = require('path');
const request = require('request');
var config = require('../config');
var bx24_url = config.BX24_URI;
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

const query = `SELECT access_token FROM token`;

/* GET users listing. */
router.get('/shop', function(req, res, next) {
  //res.sendFile(path.resolve(__dirname, '../public/shop.html'));
pgPool.query(query,[], function(err, response){
  if (err) return console.error(error);
  var tkn = response.rows[0].access_token;
  request(bx24_url+"crm.product.list", function(error, response, body) {
      var prdlist = JSON.parse(body);
       console.log(prdlist.total+" prodcut(s) successfuly loaded");
       console.log(prdlist.result[0].DETAIL_PICTURE); // debug
       res.render('shop.pug',{
         title: "shop",
         isRegistred: req.session.userId,
         products_list: JSON.parse(body),
         products_quantity: prdlist.total,
         img_token: tkn
       })
  });
});
});

module.exports = router;
