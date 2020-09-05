var express = require('express');
var router = express.Router();
var path = require('path');
const session = require('express-session');
var bodyParser = require('body-parser')
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

function createNews(header, intro, body, img) {
  var today = new Date();
  //var time = today.getDate()+"."+today.getMonth()+"."+today.getFullYear();
  //console.log(time);
  var data = {
    date: today,
    header: header,
    body: body,
    img_url: img,
    intro: intro
  }
  var query = "INSERT INTO sales(date, header, body, img_url, intro) VALUES($1,$2,$3,$4,$5)";
  pgPool.query(query, [data.date, data.header, data.body, data.img_url, data.intro], function(err, response){
    if(err) return console.error(err);
  });
}

const urlencodedParser = bodyParser.urlencoded({extended: false});
router.route('/add')
  .get(function(req,res){
    var delQ = "DELETE FROM sales"
    pgPool.query(delQ, [], function(err, response){
      if(err) return console.error(err);
    });
    res.send("<script>document.location.href='/sales'</script>");
  }).post(urlencodedParser, function(req,res){
    createNews(req.body.title, req.body.desc, req.body.body, req.body.img);
    res.send("ok");
  });

  module.exports = router;
