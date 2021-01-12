const crypto = require('crypto');
const User = require('../models/User');
const url = require('url');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {validationResult} = require('express-validator')

const sendGridOptions = require('../util/options').sendGridOptions;

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: sendGridOptions.apiKey
  }
}));

exports.getLogin = (req, res, next) => {

  // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
  res.render('auth/login', {
    pageTitle : 'Login',
    path      : '/auth/login',
    alertError: {
      msg: req.flash('error') //req.query.error
    },
    username  : false,
    CSS       : {
      formsCSS: true,
      authCSS : true
    }
  });
}
exports.getReset = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';

  res.render('auth/reset', {
    pageTitle : 'Reset Password',
    path      : '/auth/reset',
    alertError: {
      msg: req.flash('error') //req.query.error
    },
    username  : false,
    CSS       : {
      formsCSS: true,
      authCSS : true
    }
  });
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  req.flash('info', 'Enter New Password')
  User.findOne({
    resetToken          : token,
    resetTokenExpiration: {$gt: Date.now()}
  })
    .then((user) => {
      if (user) {
        res.render('auth/new-password', {
          path      : '/auth/new-password',
          pageTitle : 'Reset Password',
          userId    : user._id.toString(),
          email     : user.email,
          alertError: {
            msg: req.flash('info') //req.query.error
          },
          CSS       : {
            formsCSS: true,
            authCSS : true
          }
        })
      } else {
        console.log('no user')
        res.redirect('/')
      }
    })
    .catch(err => {
      console.log('getNewPassword')
      err.httpStatusCode = 500;
      return next(err);
    })
}

exports.postNewPassword = (req,res,next)=>{
  // update password
  User.findById(req.body.userId)
    .then(user => {
      if (!user) {
        //TODO:
        req.flash('info', 'User Not Found');
        res.redirect('/auth/login');
      }
      return user.save(req.body.password, 'reset')

    })
    .then(result => {
      if (result) {
        req.flash('info', 'Password Updated. Please login');
      }
      res.redirect('/auth/login');

    })
    .catch(err => {
      console.log('postNewPassword', err);
      err.httpStatusCode = 500;
      return next(err);
    })
}


exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      console.log('postReset', err);
      req.flash('error', 'Error in resetting. Check logs');
      return res.redirect('/reset');
    } else {
      const token = buf.toString('hex');
      User.findByEmail(req.body.email)
        .then(user => {
          if (!user) {
            req.flash('error', 'No User Exists with ' + req.body.email);
            res.redirect('/auth/login');
          } else {
            //User.resetPasword
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
          }
        })
        .then(result => {
          transporter.sendMail({
            to     : req.body.email,
            from   : 'gillyspy@gmail.com',
            subject: 'Password reset request',
            html   :
              `<p>You requested a password reset</p>
<p>Click this <a href="http://localhost:3000/auth/new-password/${token}">link</a> 
 to set a new password </p>`
          })
          res.redirect('/auth/login');
        })
        .catch(err => {
          console.log('postReset');
          err.httpStatusCode = 500;
          return next(err)
        })
    }
  })
}

exports.getSignup = (req, res, next) => {
  //TODO:
  res.render('auth/signup', {
    pageTitle  : 'SignUp',
    path       : '/auth/signup',
    alertError : {
      msg: req.query.error
    },
    sessionData: req.sessionData,
    CSS        : {
      formsCSS: true,
      authCSS : true
    }
  })
}

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
  const email = req.body.email;
  const password = req.body.password;
  let e;
  const {errors} = validationResult(req);

  if (errors.length) {
    return res.status(422).render('auth/login', {
      path      : '/login',
      pageTitle : 'Login',
      alertError: {
        msg: errors.pop().msg
      },
      CSS       : {
        formsCSS: true,
        authCSS : true
      },
      seed      : {
        email          : email,
        password       : password
      },
      errors : errors
    })
  }
  User.findByEmail(email, password) // '5fbed4dec2bfe2c8fe8db3d4')
    .then(user => {
      if (user === null) {
        throw new Error('User not found');
      } else {
        req.session.user = user;
      }
      return user.checkPassword(password);
    })
    .then(isAuthenticated => {
      req.session.isLoggedIn = isAuthenticated;
      if (isAuthenticated) {
        return req.session.save(err => {
          if (err) {
            console.log(err);
            throw err;
          }
        });
      } else {
        req.session.user = null;
        throw new Error('credentials do not match');
      }
    })
    .then((thing) => {
      console.log('thing', thing);
      res.redirect('/');
    })
    .catch(err => {
      Promise.resolve(req.flash('error', err.message))
        .then(() => {
          res.redirect(url.format({
            pathname: '/auth/login',
            query   : {
              error: err.message || 'unknown'
            }
          }));
        });
    });
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });

}

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const {password, confirmPassword} = {
    _ : req.body.password,
    __: req.body.confirmPassword
  };
  const {errors} = validationResult(req);
    if (errors.length) {
    return res.status(422).render('auth/signup', {
      path      : '/signup',
      pageTitle : 'Signup',
      alertError: {
        msg: errors.pop().msg
      },
      CSS       : {
        formsCSS: true,
        authCSS : true
      },
      seed      : {
        email          : email,
        password       : password,
        confirmPassword: confirmPassword
      },
      errors : errors
    })
  } else {
    const user = new User(email, email);
    return user.save(req.body.password)
      .then(keepGoing => {
          console.log(keepGoing);
          req.flash('success', 'User Created. Please Log In');
          if (keepGoing) {
            transporter.sendMail({
              to     : email,
              from   : sendGridOptions.sender,
              subject: 'Your new shop account',
              html   : `<h1>You successfully signed up!</h1>`
            });
            //no need to wait for the email to be sent
            res.redirect(url.format({
              pathname: '/auth/login',
              query   : {
                error: req.flash('success') //'User created. Please log in'
              }
            }));
          } else {
            throw Error('something went wrong')
          }
        }
      )
      .catch(err => {
        console.log(err);
        res.redirect(url.format({
            pathname: '/auth/signup',
            query   : {
              error: (err.message || '')
            }
          })
        );
      });
  }
}
