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
      const existingProductIndex = cart.products.findIndex((prod) => prod.id === id);
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
            let cart = JSON.parse(fileContent);
        } else{
            //empty
            //TODO:
        }

    })
  }

  static deleteById( id, price ){
     fs.readFile(p, (err, fileContent) => {
       if (err) {
         return;
       }    
       let cart = JSON.parse(fileContent);
       const updatedCart = cart;
       updatedCart.products = cart.products.filter((prod) => {
         if (prod.id != id) {
           return true;
         } else {
           updatedCart.totalPrice =
             updatedCart.totalPrice - +price * +prod.qty
           return false; //filter out
         }
       });
       fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
         console.log(err);
       });
     });
  }
};
