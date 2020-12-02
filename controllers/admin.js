const Product = require('../models/Product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle      : 'Add Product',
    path           : '/admin/add-product',
    editing        : false,
    activeProduct  : true,
    CSS            : {
      formsCSS: true,
    },
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    req.body.title,
    req.body.description,
    req.body.imageURL,
    req.body.price,
    null,
    req.session.user._id
    //req.body.id
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
  Product.findById(prodId).then( (product) => {
    console.log('getEditProduct', product, editMode);
    res.render('admin/edit-product', {
      pageTitle      : 'Edit Product',
      path           : '/admin/edit-product',
      editing        : editMode,
      product        : product,
      CSS            : {
        formsCSS: true,
      },
    });
  }).catch(err=>{
    console.log(err);
  })
};

exports.postEditProduct = (req, res, next) => {
  const product = new Product(
    req.body.title,
    req.body.description,
    req.body.imageURL,
    req.body.price,
    req.body.id
  );
  product.save().then( result=>{
    res.redirect('/admin/product-list');  
  }).catch(err=>{
    console.log(err);
  })

};

exports.postDeleteProduct = (req, res, next) => {
  Product.deleteById(req.body.id).then( () => {
    res.redirect('/admin/product-list');
  }).catch(err=>{
    console.log(err);
  })
};
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('admin/product-list', {
        catalogue      : products,
        pageTitle      : 'Admin Products',
        path           : '/admin/product-list',
        size           : products.length,
        //activeShop: true,
        CSS            : {
          formsCSS  : true,
          productCSS: true,
        },
        //      activeAddProduct: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};


