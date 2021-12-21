const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
// database connection
const mongoDb = process.env.CONNECTION;
const connection = mongoose.connect(mongoDb, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

// setting up view engine
const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
const routes = require('./routes/index');

// using middlewares
app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.use(
  session({
    secret: 'session storage tutorial',
    resave: false,
    saveUninitialized: true,
    cookie: {
      _expires: 1000 * 60 * 60 * 24,
      originalMaxAge: 1000 * 60 * 60 * 24,
    },
  })
);
require('./config/passport.js');
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use((req, res, next) => {
  next();
});

app.use('/', routes);
app.use((err, req, res, next) => {
  res.render('error', { error: err });
});
const port = process.env.port || 5000;
console.log('This is the port - %d', port);
app.listen(port, ()=> console.log(`listening to ${port}`));
