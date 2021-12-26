const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cookieParse = require('cookie-parser');
const bodyParser  =require('body-parser');
const User = require('./models/User');
const flash = require('connect-flash');
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
    secret: 'session_storage_tutorial',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: Date.now() + 864000
    }
  })
);
app.use(flash());
require('./config/passport.js')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));


passport.serializeUser( function(user, done){
  done(null,user.id);
})
passport.deserializeUser( function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(function (err, req, res, next) {
  res.locals.currentUser = req.user;
  
  next(err);
});

app.use('/', routes);
app.use((err, req, res, next) => {
  res.render('error', { error: err });
});
const port = process.env.port || 5000;
console.log('This is the port - %d', port);
const host = '0.0.0.0';
app.listen(port,  ()=> console.log(`listening to ${port}`));