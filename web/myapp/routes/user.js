var express = require('express');
var router = express.Router();
var path = require('path');
var app = require('../app');

/* GET users listing. */
const redirectLogin = function(req,res,next){
  if(!app.userID){
    res.redirect('/login')
  }else {
    next()
  }
}
router.get('/user', redirectLogin, function(req, res, next) {
  res.sendFile(path.resolve(__dirname, '../public/user.html'));
  console.log(app.userID)
});

module.exports = router;
