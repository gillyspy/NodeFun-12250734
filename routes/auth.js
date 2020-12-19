const express = require('express');
const {check, body} = require('express-validator');
const User = require('../models/User');
const authController = require('../controllers/auth');

const router = express.Router();

const rules = {
  email : opts =>{
    const {field,msg} = Object.assign({
      msg:'Email is invalid'
    },opts );
    return body(field).isEmail()
      .withMessage(msg)
  },
  password : opts =>{
    const {field,msg} = Object.assign({
      msg:'Password must be > 5 numbers and characters'
    },opts );
    return body(field, msg)
      .isLength({
        min: 5,
        max: 10
      })
      .isAlphanumeric()
  },
  /*
  o.field
  o.msg
   */
  password2 : opts => {
    const {field,msg} = Object.assign({msg:'Passwords do not match'},opts )
    return body(field).custom((value, {req}) => {
        if (value !== req.body.password) {
          throw new Error(msg);
        }
        return true;
      }
    )
  }
}

router.get('/login', authController.getLogin)
router.get('/signup', authController.getSignup)
router.post('/login', [
    rules.email({field : 'email'}).bail(),
    rules.password({field : 'password'})],
  authController.postLogin)
router.post('/logout', authController.postLogout)
router.post('/signup', [
    rules.email({field : 'email'}).bail()
      .custom(email => {
        return User.findByEmail(email).then(user => {
          if (user) {
            return Promise.reject(messages[1])
          }
          return true;
        })
      }).withMessage( 'User already exists!'),
    rules.password({field : 'password'}),
    rules.password2({field : 'confirmPassword'})],
//check('password').matches()
  authController.postSignup
)
router.get('/reset', authController.getReset)
router.post('/reset', authController.postReset)
router.get('/new-password/:token', authController.getNewPassword)
router.post('/new-password', authController.postNewPassword)

exports.routes = router;
