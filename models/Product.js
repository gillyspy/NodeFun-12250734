const fs = require('fs');
const path = require('path');

const Cart = require('./Cart');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
);

const  getProductsFromFile =  (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (!err) {
      return cb(JSON.parse(fileContent));
    } else {
      return cb([]);
    }
  });
};

module.exports = class Product {
  constructor(t, d = 'TBD', u, price, id = null) {
    this.id = id;
    this.title = t;
    this.description = d;
    this.url = u;
    this.price = price;
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
      const product = products.find((prod) => prodId === prod.id);
      cb(product);
    });
  }

  static deleteById(prodId) {
    //filter out the product and then re-write file
    try {
      if (!prodId) {
        throw new Error('missing product id. Cannot do delete');
      }
      let filteredProducts=[];
      getProductsFromFile((products) => {
        let price=0;
        
        filteredProducts = products.filter((prod) =>{
          if( prod.id == prodId){
            price = prod.price; 
            return false
          } else {
            return true
          }
        });
         fs.writeFile(p, JSON.stringify(filteredProducts), (err) => {
            
           if(err){
             throw err;             
           } else {
             //delete from cart
            Cart.deleteById(prodId, price);
           }
          });
      });

      
    } catch (e) {
      console.log(e);
    }
  }
};
