const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const rootDir = require("./util/path.js");

const app = express();

app.set("view engine", "ejs");
app.set("views", process.cwd() + "/views");

const adminData = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");

const Four04Controller = require('./controllers/404.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "pub")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

//404
app.use( Four04Controller.get404  );

app.listen(3000);
