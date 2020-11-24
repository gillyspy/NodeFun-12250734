const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (!err) {
      return cb(JSON.parse(fileContent));
    } else {
      return cb([]);
    }
  });
};

module.exports = class Product {
  constructor(t, d = 'TBD', u, p, id = null) {
    this.id = id;
    this.title = t;
    this.description = d;
    this.url = u;
    this.price = p;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        // update (replace)
        const productToUpdateIndex = products.findIndex(
          (p) => p.id === this.id
        );
        products[productToUpdateIndex] = this;
      } else {
        //new
        this.id = Math.random().toString();
        products.push(this);
      }
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(prodId, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => prodId === p.id);
      cb(product);
    });
  }
};
