var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();
//var passport = require('passport');
var port = process.env.PORT || 8042;
var flash = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

//configurar aplicacion express
app.use(morgan('dev')); // registrar cada solicitud en la consola
app.use(cookieParser()); // leer las cookies (necesarias para la autenticación)
//app.use(bodyParser()); // get information from html forms

app.use(session({
    secret: 'Josselyn`s Store......',
    resave: true,
    saveUninitialized: true
}));
app.use(flash()); // connect-flash para mensajes flash almacenados en la sesión
//app.use(passport.initialize());
//app.use(passport.session()); // sesiones de inicio de sesión persistentes

var router = require('./config/routes.js');
app.use('/', router);
//modelos
var models = require('./app/modelos/');
models.sequelize.sync().then( () => {
    console.log('Se ha conectado a la Base de datos');
}).catch(err => {console.log(err, "Hubo un error");}) ;

//launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


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