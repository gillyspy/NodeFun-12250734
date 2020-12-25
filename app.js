const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const User = require('./models/User');
const options = require('./util/options');
const dbConfig = options.configOptions.db;
const secretConfig = options.configOptions.secret;
const csrfProtection = require('csurf')();
const flash = require('connect-flash');

const MONGODBURI =
  'mongodb+srv://' + dbConfig.username
  + ':' + dbConfig.password
  + '@' + dbConfig.host + '/shop';

const mongoConnect = require('./util/db').mongoConnect;
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();
const store = MongoDBStore({
  uri : MONGODBURI,
  collection : 'sessions'
});

app.set("view engine", "ejs");
app.set("views", process.cwd() + "/views");

const adminData = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const authRoutes = require("./routes/auth.js");

const errorController = require('./controllers/error.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "pub")));
app.use(session({
  secret           : secretConfig,
  resave           : false,
  saveUninitialized: false,
  store            : store
}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  // initialize appData for the requests
  req.appData = req.appData || {};
  if (!req.appData.sessionDefaults) {
    req.appData.sessionDefaults = {
      username: 'anonymous',
      email   : ''
    }
  }
  if (!res.locals.sessionData) {
    res.locals.sessionData = {
      sessionfooter: req.appData.sessionDefaults,
      kwijibo      : 'kwijibo'
    }
  }

  res.locals.isAuthenticated = req.session ? req.session.isLoggedIn : false;

  if (!req.session.isLoggedIn) {
    res.locals.sessionData.sessionfooter = req.appData.sessionDefaults;
  } else {
    //if logged in include data with key login info
    res.locals.sessionData.sessionfooter = {
      username: req.session.user.username,
      email   : req.session.user.email
    }
  }
  res.locals.csrfToken = req.csrfToken();

  next();
});

app.use((req, res, next) => {
  if (req.session && req.session.user && req.session.user._id) {
    User.findById(req.session.user._id)
      .then(user => {
        if (!user) {
          return next();
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        next();
      })
      .catch(err => {
        throw new Error(err)
      });
  } else {
    return next();
  }
});

app.use("/admin", adminData.routes);
app.use("/auth", authRoutes.routes);
app.use(shopRoutes);

app.get('/500', errorController.get500);
app.use( (error, req, res, next)=>{
  console.log('********************************', error);
  //TODO: refactor this to handle different error types / codes
  res.redirect('/500')
});
//404
app.use(errorController.get404);


mongoConnect(() => {

  app.listen(3000);
});
