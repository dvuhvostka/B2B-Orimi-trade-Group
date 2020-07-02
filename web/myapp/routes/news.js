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
  user: USER,
  password: PASSWORD,
  database: DBNAME
});


var getNews = `SELECT * FROM news ORDER BY id DESC`;
/* GET users listing. */
router.get('/news', function(req, res, next) {
  pgPool.query(getNews,[], function(err, response){
    if (err) return console.error(err);
    var news = response.rows;
    //console.log(news); //debug
    res.render('news.pug',{
    	isRegistred: req.session.userId,
      pnews: news,
      news_q: news.length
    })
  });
});

module.exports = router;
