var express = require('express');
var router = express.Router();
var path = require('path');
const session = require('express-session');
var bodyParser = require('body-parser')
var config = require('../config');
var {Pool, Client} = require('pg');


router.route('/info')
  .get(function(req,res){
    res.render('info.pug', {
      isRegistred: userinfo.user_id,
      title: 'Фирменный магазин Орими-трэйд',
      needFooter: false,
      });
  }).post(function(req,res){
    res.send("POST");
  });

module.exports = router;
