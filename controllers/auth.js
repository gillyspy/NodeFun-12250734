const User = require('../models/User');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
  console.log(req.session, req.session.isLoggedIn);
  req.session = null;
  res.render('auth/login', {
    pageTitle      : 'Login',
    path           : '/login',
    isAuthenticated: false,
    alertError     : {
      msg: req.query.error
    },
    CSS            : {
      formsCSS: true,
      authCSS : true
    }
  });
}

exports.getSignup = (req, res, next)=>{

  //TODO:
  res.render('auth/signup', {
    pageTitle      : 'SignUp',
    path           : '/signup',
    isAuthenticated: req.session ? !!req.session.isLoggedIn : false,
    alertError     : {
      msg: req.query.error
    },
    CSS            : {
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

      req.session.isLoggedIn = true;
      if( user === null){
        e= 'Credentials do not match';
        res.redirect('/auth/login?error='+encodeURIComponent(e));
      } else {
        req.session.user = user;
        req.session.save(err => {
          if (err) {
            console.log(err);
            return err;
          }
          res.redirect('/');

        });
      }
    }).catch(err => {
    console.log(err);
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
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  //does user already exist
  User.findByEmail(email).then((user) => {
    //null is good
    if (user === null && password === confirmPassword) {
      const user = new User(email, email);
      if( user.save(password)) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
          if (err) {
            console.log(err);
            return err;
          }
          res.redirect('/');
        });
      }
      //add user to db (email a verification? )
    } else { // (user !== null){
      const e = encodeURIComponent('User already exists');
      res.redirect('/auth/signup?error='+e);
      //message that username is already in use
    }
    //res.redirect('/');
  }).catch(err => {
    console.log(err);
    res.redirect('/');
  });

}