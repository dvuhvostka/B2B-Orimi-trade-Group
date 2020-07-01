var express = require('express');
var router = express.Router();
var path = require('path');
const request = require('request');
var config = require('../config');
var bx24_url = config.BX24_URI;




/* GET users listing. */
router.get('/shop', function(req, res, next) {
  //res.sendFile(path.resolve(__dirname, '../public/shop.html'));

  request(bx24_url+"crm.product.list", function(error, response, body) {
      var prdlist = JSON.parse(body);
       console.log(prdlist.total+" prodcut(s) successfuly loaded");
       console.log(prdlist); // debug
       res.render('shop.pug',{
         title: "shop",
         isRegistred: req.session.userId,
         products_list: JSON.parse(body),
         products_quantity: prdlist.total
       })
  });
});

module.exports = router;
