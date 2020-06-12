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

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var newsRouter = require('./routes/news');
var shopRouter = require('./routes/shop');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var logoutRoute = require('./routes/logout')

var app = express();

const TWO_DAYS = 1000 * 60 * 60 * 24 * 2; //2 days in miliseconds


//var for sessions and connecting to databse
const {
  SESS_LIFETIME = TWO_DAYS,
  ENVIRONMENT = 'development',
  SESS_NAME = 'sid',
  SESS_SECRET = 'ssh!quiet,it\'dexat0randz0rax!',
  USER = 's0rax',
  PASSWORD = '121212',
  HOST = 'localhost'
} = process.env
//while we develop the web site ENVIRONMENT = development and IN_PROD = false.
const IN_PROD = ENVIRONMENT === 'production';
//coneccting to database config
var pgPool = new Pool({
  host: HOST,
  user: USER,
  password: PASSWORD,
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
      tableName: 'session'
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
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.static('public/javascripts'));
app.use(express.static('public/stylesheets'));

//app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', newsRouter);
app.use('/', shopRouter);
app.use('/', registerRouter);
app.use('/', loginRouter.login);
app.use('/', logoutRoute);


app.use(function(req, res, next) {
  switch (!null) {
    case userinfo.user_id!=null: req.session.userId = userinfo.user_id; break;
  }
  next();
})

app.get('/', function(req,res){
  const { userId } = req.session;
  console.log(req.session.id);
  console.log(req.session);
  console.log(req.session.userId);
  if(req.session.userId)
    var isRegistred = true;
  else
    isRegistred = false;
  console.log(isRegistred);
  //res.sendFile(path.join(__dirname, '/public/index.html'));
  res.render('index', {
    title: 'Main page',
    isRegistred: req.session.userId !== undefined,
    isRoot: true
});
})


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
