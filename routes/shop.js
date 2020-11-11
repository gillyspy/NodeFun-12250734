const path = require("path");
const express = require("express");

const rootDir = require("../util/path.js");
const adminData = require("./admin");

const router = express.Router();
router.get("/", (req, res, next) => {
  const products = adminData.products;
  const shop = {
    catalogue: products,
    pageTitle: "Shop",
    size: products.length,
    activeShop: true,
    productCSS: true,
  };

  res.render("shop", shop);
});

module.exports = router;
