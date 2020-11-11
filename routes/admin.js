const path = require("path");
const express = require("express");

const rootDir = require("../util/path.js");

const router = express.Router();

const products = [];

router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
});
router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title, description : req.body.description });
  console.log("perhaps adding product in the database?", products);
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
