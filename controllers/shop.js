const Product = require('../models/Product');
exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    const shop = {
      catalogue: products,
      pageTitle: 'All Products',
      path: '/products',
      size: products.length,
      activeShop: true,
      CSS: {
        formsCSS: true,
        productCSS: true,
      },
      activeAddProduct: true,
    };

    res.render('shop/product-list', shop);
  });
};

exports.getIndex = (req, res, next) => {
  const products = Product.fetchAll((products) => {
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
    res.render('shop/index', shop);
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Cart',
    path: '/cart',
    CSS: {},
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
    CSS: {},
  });
};
