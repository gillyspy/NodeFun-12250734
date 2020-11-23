const Product = require('../models/Product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeProduct: true,
    CSS: {
      formsCSS: true,
    },
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    req.body.title,
    req.body.description,
    req.body.imageURL,
    req.body.price
  );
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/product-list', {
      catalogue: products,
      pageTitle: 'Admin Products',
      path: '/admin/product-list',
      size: products.length,
      activeShop: true,
      CSS: {
        formsCSS: true,
        productCSS: true,
      },
      activeAddProduct: true,
    });
  });
};
