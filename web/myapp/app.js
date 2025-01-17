var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var helmet = require('helmet');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
var {Pool, Client} = require('pg');
const pgp = require("pg-promise")(/*options*/);
var config = require('./config');



//var for sessions and connecting to databse
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


global.db = pgp("postgres://"+config.DB_USER+":"+config.DB_PASSWORD+"@"+config.DB_HOST+":5432/"+config.DB_NAME);



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var salesRouter = require('./routes/sales');
var shopRouter = require('./routes/shop');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var logoutRoute = require('./routes/logout');
var cartRoute = require('./routes/cart');
var addnewsRoute = require('./routes/add');
var infoRoute = require('./routes/info');
var orderRoute = require('./routes/order');
var dealsRoute = require('./routes/deals');

var app = express();

//const TWO_DAYS = 1000 * 60 * 60 * 24 * 2; //2 days in miliseconds

//while we develop the web site ENVIRONMENT = development and IN_PROD = false.
const IN_PROD = ENVIRONMENT === 'production';
//coneccting to database config
var pgPool = new Pool({
  host: HOST,
  user: "s0rax",
  password: "MffdwehqsqAREs228T",
  database: 'mydb'
});


app.use(cookieParser());
//Coockies, session config
app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD,
    path: '/'
  },
  store: new pgSession({
      pool: pgPool,
      tableName: config.SESS_TB_NAME
  })
}))

app.disable('x-powered-by');
app.use(helmet());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public/images'));
app.use(express.static('public/stylesheets'));
app.use(express.static('public/javascripts'));
app.use(bodyParser.json());

// app.use(function(req, res, next) {
//   switch (!null) {
//     case userinfo.user_id!=null: req.session.userId = userinfo.user_id; break;
//     case req.session.userId!=null: userinfo.user_id = req.session.userId; break;
//   }
//   next();
// })

app.get('/', function(req,res){
  const { userId } = req.session;
  res.redirect('/shop');
});


//app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', salesRouter);
app.use('/', shopRouter);
app.use('/', registerRouter);
app.use('/', loginRouter.login);
app.use('/', logoutRoute);
app.use('/', addnewsRoute);
app.use('/', cartRoute);
app.use('/', infoRoute);
app.use('/', orderRoute);
app.use('/', dealsRoute)

app.use('/?', function(req,res){
  res.redirect('/');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {
  app: app,

};
