var express = require('express');
var router = express.Router();
var path = require('path');

/* GET users listing. */
router.get('/shop', function(req, res, next) {
  //res.sendFile(path.resolve(__dirname, '../public/shop.html'));
  res.render('shop.pug',{
    title: "shop",
    isRegistred: req.session.userId,
  })
});

module.exports = router;
