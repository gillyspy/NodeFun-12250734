/* all product logic */
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeProduct: true,
    CSS: {
      formsCSS: true,
    },
  });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title, req.body.description);
    product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll()

  const shop = {
    catalogue: products,
    pageTitle: 'Shop',
    path: '/',
    size: products.length,
    activeShop: true,
    CSS: {
      formsCSS: true,
      productCSS: true,
    },
    activeAddProduct: true,
  };

  res.render('shop', shop);
};