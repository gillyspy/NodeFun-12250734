const User = require('../models/User');
const url = require('url');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
  console.log(req.session, req.session.isLoggedIn);
  req.session = null;
  res.render('auth/login', {
    pageTitle      : 'Login',
    path           : '/auth/login',
    alertError     : {
      msg: req.query.error
    },
    username       : false,
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
    path           : '/auth/signup',
    alertError     : {
      msg: req.query.error
    },
    sessionData : req.sessionData,
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
    .then( (thing)=>{
      console.log('thing',thing);
      res.redirect('/');
    })
    .catch(err => {
      res.redirect(url.format({
        pathname: '/auth/login',
        query   : {
          error: err.message || 'unknown'
        }
      }));
    })

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
        res.redirect(url.format({
          pathname: '/auth/login',
          query : {
            error : 'User created. Please log in'
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