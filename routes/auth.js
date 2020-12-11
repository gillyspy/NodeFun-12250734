const express = require('express');
const {check, body} = require('express-validator');
const User = require('../models/User');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin)
router.get('/signup', authController.getSignup)
router.post('/login', authController.postLogin)
router.post('/logout', authController.postLogout)
router.post('/signup', [
    body('email').isEmail().withMessage('Email is invalid').bail()
      .custom(email => {
        return User.findByEmail(email).then(user => {
          if (user) {
            return Promise.reject('User already exists')
          }
          return true;
        })
      }).withMessage('User already exists!'),
    body('password', 'Password must be > 5 numbers and characters')
      .isLength({
        min: 5,
        max: 10
      })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, {req}) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }
    )],
//check('password').matches()
  authController.postSignup
)
router.get('/reset', authController.getReset)
router.post('/reset', authController.postReset)
router.get('/new-password/:token', authController.getNewPassword)
router.post('/new-password', authController.postNewPassword)

exports.routes = router;
