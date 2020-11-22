const fs = require('fs');
const path = require('path');
const products = [];
module.exports = class Product {
    constructor(t, d='TBD'){
        this.title = t;
        this.description = d; 
        //this.products = products;
    }

    save() {
        const p = path.join(
          path.dirname( require.main.filename ),
          'data',
          'products.json'
        );
        fs.readFile(p, (err, fileContent) => {
          let products = [];
          if (!err) {
            products = JSON.parse(fileContent);
          }
          products.push(this);
          fs.writeFile(p, JSON.stringify(products), err =>{
            console.log(err);
          });
          
        });
    }

    static fetchAll(cb){
        const p = path.join(
          path.dirname(require.main.filename),
          'data',
          'products.json'
        );
        return fs.readFile(p, (err, fileContent) => {         
          if (!err) {
            cb( JSON.parse(fileContent) );
          } else {
            cb( [] );
          }
        });
    }
}