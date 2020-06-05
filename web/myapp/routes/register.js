var express = require('express');
var router = express();
var path = require('path');
var bodyParser = require('body-parser');

/* GET users listing. */
router.route('/')
  .get(function(req, res) {
    res.sendFile(path.resolve(__dirname, '../public/register.html'));
  })
  .post(function(req,res){
    console.log(req.body);
    //res.redirect('/register');
    res.send(req.body);
  });

module.exports = router;
