const crypto = require('crypto');
const User = require('../models/User');
const url = require('url');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

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
      res.render('auth/new-password', {
        path      : '/auth/new-password',
        pageTitle : 'Reset Password',
        userId    : user._id.toString(),
        email : user.email,
        alertError: {
          msg: req.flash('info') //req.query.error
        },
        CSS : {
          formsCSS : true,
          authCSS : true
        }
      })
    }).catch(err => {
    console.log(err);
  })
}

exports.postNewPassword = (req,res,next)=>{
  // update password
  User.findById( req.body.userId )
    .then( user =>{
      if( ! user ){
        //TODO:
        req.flash('info','User Not Found');
        res.redirect('/auth/login');
      }
      return user.save( req.body.password, 'reset' )

    })
    .then( result =>{
      if( result ) {
        req.flash('info', 'Password Updated. Please login');
        res.redirect('/auth/login');
      }
    })
    .catch(err =>{
      console.log(err);
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
          console.log('postReset', err);
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
  //TODO: fix this fake login process
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
  //TODO: add validation
  const email = req.body.email;
  const {password, confirmPassword} = {
    _ : req.body.password,
    __: req.body.confirmPassword
  };

  User.findByEmail(email).then((user) => {
    if (user === null) {
      //continue
      return req.body.password === req.body.confirmPassword;
    }
    throw new Error('User already exists');
    return false;
  })
    .then(keepGoing => {
      const user = new User(email, email);
      return user.save(req.body.password);
    })
    .then(keepGoing => {
      console.log(keepGoing);
      if (keepGoing) {
        transporter.sendMail({
          to     : email,
          from   : sendGridOptions.sender,
          subject: 'Your new shop account',
          html   : `<h1>You successfully signed up!</h1>`
        });
        res.redirect(url.format({
          pathname: '/auth/login',
          query   : {
            error: 'User created. Please log in'
          }
        }));
      } else {
        throw Error('something went wrong')
      }
    }).catch(err => {
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
/*
then(save => {
  req.session.isLoggedIn = true;
  req.session.user = user;
  req.session.save(err => {
    if (err) {
      console.log(err);
      return err;
    }
    res.redirect('/');
  });
}).catch(err => {
  console.log(err);
  res.redirect('/');
});
}
)

console.log(password, confirmPassword);
//does user already exist


}*/