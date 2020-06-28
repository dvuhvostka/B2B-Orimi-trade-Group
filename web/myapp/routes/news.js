var express = require('express');
var router = express.Router();
var path = require('path');
const session = require('express-session');

/* GET users listing. */
router.get('/news', function(req, res, next) {
    res.render('news.pug',{
    	isRegistred: req.session.userId,
    })

});

module.exports = router;
