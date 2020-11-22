const path = require('path');
const express = require('express');

const rootDir = require('../util/path.js');
const adminData = require('./admin');

const router = express.Router();
router.get('/', (req, res, next) => {
  const products = adminData.products;
  const shop = {
    catalogue: products,
    pageTitle: 'Shop',
    path : '/',
    size: products.length,
    activeShop: true,
    CSS : {
      formsCSS : true,
      productCSS : true
    },
    activeAddProduct: true
  };

  res.render('shop', shop);
});

module.exports = router;
