var express = require('express');
var app = express();
var port = process.env.PORT || 8082;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var dbConfig = require('./config/database.js');

mongoose.connect(dbConfig.url);
var db = mongoose.connection;
db.on('error', function callback(err) {
    console.log(err);
});
db.once('open', function callback() {
    console.log("h");
});

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'ejs');

app.use(session({ secret: 'adaptivewebassignmentone' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Service is running on port: ' + port);
