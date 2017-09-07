let express = require('express');
let app = express();
let port = process.env.PORT || 8082;
let mongoose = require('mongoose');
let passport = require('passport');
let flash = require('connect-flash');

let morgan = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');

let dbConfig = require('./config/database.js');

mongoose.connect(dbConfig.url);
let db = mongoose.connection;
db.on('error', function callback(err) {
    console.log(err);
});
db.once('open', function callback() {
    console.log("Database successfully connected to " + dbConfig.url);
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
