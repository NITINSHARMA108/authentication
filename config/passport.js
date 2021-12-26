const User = require('../models/User');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
  passport.use(
  new LocalStrategy( (username, password, done) => {

  User.findOne({ username: username }, (err, user) => {
    if (err) {
      return done(err, false, {message: 'error in fetching database'});
    }
    if (!user) {
      return done(null, false, {message: 'user does not exist'});
    }
    bcrypt.compare(password, user.password)
    .then((res)=>{
      if(res){
        return done(null, user, { message: 'user found'});  
      }
      else
      {
        return done(null, false, {message: 'password is incorrect'});
      }
    })
    .catch((err)=> {
      return done(err, false, {message: 'error in fetching data'});
    })
  });
  
  })
  )
}



