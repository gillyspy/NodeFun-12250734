const User = require('../models/User');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
  console.log(req.session, req.session.isLoggedIn);
  req.session = null;
  res.render('auth/login', {
    pageTitle      : 'Login',
    path           : '/login',
    isAuthenticated: false,
    CSS            : {
      formsCSS: true,
      authCSS : true
    }
  });
}

exports.getSignup = (req, res, next)=>{
  //TODO:
  res.render('auth/signup', {
    pageTitle : 'SignUp',
    path : '/signup',
    isAuthenticated : req.session.isLoggedIn,
    CSS : {
      formsCSS : true,
      authCSS : true
    }
  })
}

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
  //TODO: fix this fake login process
  User.findById('5fbed4dec2bfe2c8fe8db3d4')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err=>{
        if(err){
          console.log(err);
          return err;
        }
        res.redirect('/');
      });
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

exports.postSignup = (req, res, next) =>{
  //TODO:

}