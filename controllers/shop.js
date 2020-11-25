const Product = require('../models/Product');
const Cart = require('../models/Cart');
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
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
      };
      console.log('getProducts', products);
      res.render('shop/product-list', shop);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);
  Product.findById(prodId).then((product) => {
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
  }).catch(err=>{
    console.log(err);
  });

  //res.redirect('/');
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then((products) => {
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
    console.log('Get Index', 'render index', products);
    res.render('shop/index', shop);
  })
  .catch((err) => {
    console.log(err);
    res.end();
  });
  
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      for (cp of cart.products) {
        for (p of products) {
          if (cp.id === p.id) {
            cp.data = p;
          }
        }
      }
      console.log('Cart Products to Display', cart.products);
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        cart: cart,
        CSS: {},
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });

  console.log('prodId', prodId);
  //TODO:as
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  //TODO;
  Product.findById(req.body.productId, (p) => {
    Cart.deleteById(p.id, p.price);
    console.log('todo');
    res.redirect('/cart');
  });
  
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
