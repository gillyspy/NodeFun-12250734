/* all product logic */
const products = [];

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
  products.push({title: req.body.title, description: req.body.description});
  console.log('perhaps adding product in the database?', products);
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
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