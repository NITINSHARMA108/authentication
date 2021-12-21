const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');
const passport = require('passport');

router.get('/', messageController.redirect);

router.get('/messages', messageController.get_messages);

router.get('/join-membership', userController.get_user_membership);

router.post('/join-membership', userController.post_user_membership);

router.get('/signup', userController.signup_get);

router.post('/signup', userController.signup_post);

router.get('/login', userController.login_get);

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

router.get('/create_message', messageController.get_create_message);

router.post('/create_message', messageController.post_create_message);

router.get('/logout', userController.logout);

router.get('/:id/delete_message', messageController.delete_message);

module.exports = router;
