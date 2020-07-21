var express = require('express');
var router = express.Router();
var path = require('path');
const request = require('request');
var config = require('../config');

/* GET users listing. */
router.get('/shop', function(req, res, next) {
  res.render('shop.pug');
});

module.exports = router;
