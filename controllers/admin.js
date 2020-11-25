const Product = require('../models/Product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
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
  product.save().then( ()=>{
    res.redirect('/admin/add-product');
  })
  
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.productId;
  if (!editMode) {
    console.log('missing editMode.... redirecting to /');
    return res.redirect('/');
  }
  Product.findById(prodId, (product) => {
    console.log('getEditProduct', product, editMode);
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      CSS: {
        formsCSS: true,
      },
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const product = new Product(
    req.body.title,
    req.body.description,
    req.body.imageURL,
    req.body.price,
    req.body.id
  );
  product.save();
  res.redirect('/admin/product-list');
};

exports.postDeleteProduct = (req, res, next) =>{
  Product.deleteById( req.body.id) ;
  res.redirect('/admin/product-list');
};
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/product-list', {
      catalogue: products,
      pageTitle: 'Admin Products',
      path: '/admin/product-list',
      size: products.length,
      //activeShop: true,
      CSS: {
        formsCSS: true,
        productCSS: true,
      },
            //      activeAddProduct: true,
    });
  });
};
