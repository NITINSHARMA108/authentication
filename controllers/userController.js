const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');

const { body, validationResult } = require('express-validator');

exports.signup_get = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/messages');
  } else {
    res.render('signup_form');
  }
};

exports.signup_post = [
  body('username').trim().isLength({ min: 1 }).escape(),
  body('name').trim().isLength({ min: 1 }).escape(),
  body('password').trim().isLength({ min: 6 }).escape(),
  (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let error = [];
      errors['errors'].forEach((e) => {
        error.push(e.msg);
      });
      res.render('signup_form', { error: error });
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, async function (err, hash) {
          if (err) {
            res.redirect('/error');
          }
          let error = [];
          let isAdmin = false;
          const username = await User.findOne({ username: req.body.username });
          if (username) {
            error.push('username is not available');
            res.render('signup_form', { error });
          }
          if (req.body.isadmin === 'on') {
            isAdmin = true;
          }
          const response = await User.create({
            username: req.body.username,
            full_name: req.body.name,
            password: hash,
            isAdmin: isAdmin,
          });
          if (!response) {
            error.push('Unable to create user');
            res.render('signup_form', { error });
          } else {
            res.render('login_form');
          }
        });
      });
      /* bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      
    });*/
    }
  },
];

exports.login_get = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/messages');
  } else {
    res.render('login_form');
  }
};

exports.login_post = (req, res, next) => {
  res.redirect('/messages');
};

exports.get_user_membership = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('secret_passcode', { title: 'Join Membership' });
  } else {
    res.render('login_form', { error: ['session timed out'] });
  }
};
exports.post_user_membership = async (req, res, next) => {
  const { passcode } = req.body;
  console.log(passcode);
  console.log(req.session);
  console.log(req.user);
  if (passcode == '325476') {
    const response = await User.findByIdAndUpdate(req.user._id, {
      membership_status: true,
    });

    console.log(response);
    if (!response) {
      next();
    } else {
      res.redirect('/messages');
    }
  } else {
    res.redirect('/messages');
  }
};

exports.logout = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout();
    res.redirect('/login');
  } else {
    res.render('login_form', { error: ['session timed out'] });
  }
};
