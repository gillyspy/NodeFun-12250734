const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  
  static addProduct(id, price) {
    //fetch previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = {
        products: [],
        totalPrice: 0,
      };
      if (!err) {
        cart = JSON.parse(fileContent); //create cart
      }
      //analyze it for existing product
      const existingProductIndex = cart.products.findIndex((p) => p.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // add new product || increase qty
      if (existingProduct) {
        updatedProduct = {...existingProduct};
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {
          id: id,
          qty: 1,
        };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +price;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static fetchCart(){
    return fs.readFile(p, (err, fileContent)=>{
        if( !err ){
            cart = JSON.parse(fileContent);
        } else{
            //empty
            //TODO:
        }

    })
  }
};