var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var keys = require('./keys/urls')
var fileUpload = require('express-fileupload');
// var flash = require('connect-flash');
// var session = require('express-session');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var patientsRouter = require('./routes/patients');
var doctorsRouter = require('./routes/doctors');
var medicalsRouter = require('./routes/medicals');
var labsRouter = require('./routes/labs');

mongoose.connect(keys.mongoURL, { useUnifiedTopology: true , useNewUrlParser: true },(err) => {
  console.log(err)
  console.log('connected to database')
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());

// app.use(session({ secret: 'random', cookie: { maxAge: 3*24*60*60*1000 }}));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(flash());


//Express Message Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});


app.use('/', indexRouter);
app.use('/admin',adminRouter);
app.use('/patients', patientsRouter);
app.use('/doctors', doctorsRouter);
app.use('/medicals',medicalsRouter);
app.use('/labs',labsRouter);
// app.use('/admin',adminRouter);

// app.use(app.router);
// routes.initialize(app);

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

module.exports = app;