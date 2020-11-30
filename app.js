const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const User = require('./models/User');
const rootDir = require("./util/path.js");
const options = require('./util/options');
const config = {
        host: options.storageConfig.host,
        username: options.storageConfig.username,
        password: options.storageConfig.password
};
const MONGODBURI =
    'mongodb+srv://'+config.username+':'+config.password+'@'+config.host+'/shop';


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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "pub")));
app.use(session({
  secret : "kwijibo",
  resave : false,
  saveUninitialized : false,
  store : store
}));

app.use( ( req, res, next)=>{
  User.findById('5fbed4dec2bfe2c8fe8db3d4').then( user=>{
    req.user = new User( user.username, user.email, user._id, user.cart );
    next();
  }).catch(err=>{
    console.log(err);    
  });
});



app.use("/admin", adminData.routes);
app.use("/auth", authRoutes.routes);
app.use(shopRoutes);

//404
app.use( Four04Controller.get404  );
mongoConnect(() =>{

  app.listen(3000);
});
