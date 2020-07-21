var express = require('express');
var router = express.Router();
var path = require('path');
const request = require('request');
var config = require('../config');

/* GET users listing. */
router.route('/shop')
  .get(function(req,res){
    res.render('shop.pug', {
      isRegistred: req.session.userId
    });
  }).post(function(req,res){
    res.send("POST");
  });

module.exports = router;
