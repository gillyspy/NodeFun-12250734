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
  const product = new Product({
    title      : req.body.title,
    description: req.body.description,
    url        : req.body.imageURL,
    price      : req.body.price,
    userid     : req.session.user._id
  });
  product.save().then(isSaved => {
    //TODO : error if not saved?
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
    // TODO: only allow edit mode if user is allowed to admin this particular product
    console.log('getEditProduct', product, editMode);
    return res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path     : '/admin/edit-product',
      editing  : editMode,
      product  : product,
      CSS      : {
        formsCSS: true,
      },
    });
  }).catch(err=>{
    console.log(err);
  })
};

exports.postEditProduct = (req, res, next) => {
  //temporary product
  const _product = new Product({
    title      : req.body.title,
    description: req.body.description,
    url        : req.body.imageURL,
    price      : req.body.price,
    id         : req.body.id,
    userid     : req.session.user._id
  });
  //must be able to find one that already exists
  Product.findById(_product._id)
    .then(product => {
      //product.prepIdForDb( product._id );
      if (!product) {
        //no allowed to update
        req.flash('error', 'Could not find product to edit');
        return res.redirect('/admin/product-list');
      } else if (product.userid != _product.userid) {
        req.flash('error', 'You don\'t have permissions for that product');
        return res.redirect('/admin/product-list');
      }
      //the temp products is a shadow of the real product
      // the temporary one has the edits
      // update the temporary one
      return _product.save()
    })
    .then(result => {
      console.log('Edit result', result);
      res.redirect('/admin/product-list');
    }).catch(err => {
    console.log(err);
  })

};

exports.postDeleteProduct = (req, res, next) => {
  Product.deleteOne({
    _id   : Product.prepIdForDb(req.body.id),
    userid: Product.prepIdForDb(req.session.user._id)
  }).then(() => {
    res.redirect('/admin/product-list');
  }).catch(err => {
    console.log(err);
  })
};
exports.getProducts = (req, res, next) => {
  Product.find({userid: req.session.user._id})
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


