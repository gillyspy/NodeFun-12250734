const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const User = require('./models/User');
const options = require('./util/options');
const dbConfig = options.configOptions.db;
const secretConfig = options.configOptions.secret;

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

const Four04Controller = require('./controllers/404.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "pub")));
app.use(session({
  secret           : secretConfig,
  resave           : false,
  saveUninitialized: false,
  store            : store
}));

app.use((req, res, next) => {
  if (req.session && req.session.user && req.session.user._id){
    User.findById(req.session.user._id)
      .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        next();
      }).catch(err => {
      console.log(err)
    });
  } else {
    next();
  }
});

app.use("/admin", adminData.routes);
app.use("/auth", authRoutes.routes);
app.use(shopRoutes);

//404
app.use(Four04Controller.get404);
mongoConnect(() => {

  app.listen(3000);
});
