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
    console.log(errors);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, async function (err, hash) {
        if (err) {
          res.redirect('/error');
        }
        let isAdmin = false;
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
          res.redirect('/error');
        } else {
          res.redirect('/login');
        }
      });
    });
    /* bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      
    });*/
  },
];

exports.login_get = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/messages');
  } else {
    res.render('login_form');
  }
};

exports.login_post = (req, res, next) => {};

exports.get_user_membership = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('secret_passcode', { title: 'Join Membership' });
  } else {
    res.render('login_form');
  }
};
exports.post_user_membership = async (req, res, next) => {
  const { passcode } = req.body;
  if (passcode === '325476') {
    const response = await User.findOneAndUpdate(req.user._id, {
      membership_status: true,
    });
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
    next('session timed out');
  }
};
