const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const User = require('./models/User');
const rootDir = require("./util/path.js");

const mongoConnect = require('./util/db').mongoConnect;

const app = express();

app.set("view engine", "ejs");
app.set("views", process.cwd() + "/views");

const adminData = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");


const Four04Controller = require('./controllers/404.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "pub")));

app.use( ( req, res, next)=>{
  User.findById('5fbed4dec2bfe2c8fe8db3d4').then( user=>{
    req.user = user;
    next();
  }).catch(err=>{
    console.log(err);    
  });
});



app.use("/admin", adminData.routes);
app.use(shopRoutes);

//404
app.use( Four04Controller.get404  );
mongoConnect(() =>{

  app.listen(3000);
});
