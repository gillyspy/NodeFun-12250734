const Product = require('../models/Product');
const Cart = require('../models/Cart');
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

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);
  Product.findById(prodId, (product) => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      CSS: {
        formsCSS: true,
        productCSS: true,
      },
      path: '/products',
    });
    console.log('productId', product);
  });

  //res.redirect('/');
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

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  })
  
  console.log('prodId', prodId);
  //TODO:as
  res.redirect('/cart');
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
    CSS: {},
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders',
    CSS: {},
  });
};
