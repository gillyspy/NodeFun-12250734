const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const rootDir = require("./util/path.js");

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/views");

const adminData = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "pub")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  console.log("404");
  res.status(404).render("404", { pageTitle: "404" });
});

app.listen(3000);
