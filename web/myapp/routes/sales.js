var express = require('express');
var router = express.Router();
var path = require('path');
const session = require('express-session');
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
  user: 'z0rax',
  password: '12345',
  database: DBNAME
});


var getNews = `SELECT * FROM sales ORDER BY id DESC`;
/* GET users listing. */
router.get('/sales', function(req, res, next) {
  pgPool.query(getNews,[], function(err, response){
    if (err) return console.error(err);
    var sales = response.rows;
    //console.log(news); //debug
    res.render('sales.pug',{
    	isRegistred: req.session.userId,
      pnews: sales,
      news_q: sales.length,
      title: "Акции"
    })
  });
});

module.exports = router;
