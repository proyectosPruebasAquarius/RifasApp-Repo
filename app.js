const createError = require('http-errors');
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayout);
app.set('view engine', 'ejs');

//Middlewares
app.use(session({
  cookie: { maxAge: 60000},
  secret : 'rifasapp',
  resave : false,
  saveUninitialized : false,
  store : new MySQLStore(database)
}));
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Global variables
app.use((req, res, next) => {  
  app.locals.success = req.flash('success');
  app.locals.errors = req.flash('errors');
  app.locals.user = req.user;
  next();
})
//Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(require('./routes/authentication'));
app.use('/clientes', require('./routes/clientes'));

app.get('/username', function(req, res) {
  res.render('example');
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



app.listen(3000, () => {
  console.log('Server on Port 3000');
})

module.exports = app;