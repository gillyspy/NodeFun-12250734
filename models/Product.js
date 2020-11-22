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
  constructor(t, d = 'TBD') {
    this.title = t;
    this.description = d;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
