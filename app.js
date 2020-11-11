const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");

const rootDir = require("./util/path.js");

const app = express();

app.engine("hbs", expressHbs({ 
    layoutsDir: 'views/layouts',
    defaultLayout : 'main-layout',
    extname : 'hbs'
})); //handlebars
app.set("view engine", "hbs");
app.set("views", process.cwd() + "/views");

const adminData = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "pub")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "404" });
});

app.listen(3000);
