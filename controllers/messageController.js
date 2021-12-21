const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');

const { response } = require('express');

exports.redirect = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/messages');
  } else {
    res.redirect('/login');
  }
};

exports.get_messages = async (req, res, next) => {
  const response = await Message.find({});
  if (req.isAuthenticated()) {
    if (!response) {
      res.render('error');
    } else {
      res.render('index', { messages: response, user: req.user });
    }
  } else {
    res.redirect('/login');
  }
};
exports.get_create_message = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('create_message');
  } else {
    res.redirect('/login');
  }
};

exports.post_create_message = [
  body('title').trim().isLength({ min: 1 }).escape(),
  body('message').trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const response = await Message.create({
        title: req.body.title,
        message: req.body.message,
        author: req.user._id,
        author_name: req.user.full_name,
      });
      if (!response) {
        res.redirect('/login');
      } else {
        res.redirect('/messages');
      }
    }
  },
];

exports.delete_message = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const { id } = req.params;
    const response = await Message.findByIdAndDelete(id);
    if (!response) {
      res.render('error');
    } else {
      res.redirect('/messages');
    }
  } else {
    res.redirect('/login');
  }
};
