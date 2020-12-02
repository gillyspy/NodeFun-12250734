const Product = require('../models/Product');
const Cart = require('../models/Cart');
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      const shop = {
        catalogue      : products,
        pageTitle      : 'All Products',
        path           : '/products',
        size           : products.length,
        activeShop     : true,
        CSS            : {
          formsCSS  : true,
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
      product        : product,
      pageTitle      : product.title,
      CSS            : {
        formsCSS  : true,
        productCSS: true,
      },
      path           : '/products',
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
      catalogue       : products,
      pageTitle       : 'Shop',
      path            : '/',
      size            : products.length,
      activeShop      : true,
      CSS             : {
        formsCSS  : true,
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
  req.session.user.getCart()
      .then(products => {
        console.log('Cart Products to Display', products);
        res.render('shop/cart', {
          pageTitle      : 'Cart',
          path           : '/cart',
          cart           : products,
          CSS            : {
            formsCSS: true,
            cartCSS : true
          },
        });
      });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product => {
    console.log('add to cart');
    return req.session.user.addToCart(product);
    // Cart.addProduct(prodId, product.price);
  }).then(result => {
   // console.log(result);
    res.redirect('/products');
    //res.redirect('/cart');
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  req.session.user.deleteItemFromCart(id).then(result=>{
    console.log('deletedItemFromCart');
    res.redirect('/cart');
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle      : 'Checkout',
    path           : '/checkout',
    CSS            : {}
  });
};

exports.getOrders = (req, res, next) => {
  req.session.user.getOrders().then(orders=>{
  res.render('shop/orders', {
    pageTitle      : 'Orders',
    path           : '/orders',
    orders         : orders,
    CSS            : {
      ordersCSS: true
    }
  });
  }).catch(err=>{
    console.log(err)
  });

};


exports.postOrder = (req, res, next) => {
  req.session.user.addOrder().then(result => {
    res.redirect('/orders')
  }).catch(err => {
    console.log(err);
  });

};