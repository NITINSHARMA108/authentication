const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

const verify =async (username, password, done) => {
  let result;
  User.findOne({ username: username },async (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    
    bcrypt.compare(password, user.password)
    .then((res)=>{
      if(res){
        return done(null, user);
      }
      else
      {
        return done(null, false);
      }
    })
    .catch((err)=> {
      return done(err);
    })
    
    
    // return done(null,result);
  });
  
};
const strategy = new LocalStrategy(verify);
passport.use(strategy);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
