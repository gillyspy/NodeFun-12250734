const getDb = require('../util/db').getDb;

class Product {
  constructor(t, d = 'TBD', u, price, id = null) {    
    this.title = t;
    this.description = d;
    this.url = u;
    this.price = price;
    this.id = id || Math.random().toString()
  }


  save(){
    const db = getDb();
    db.collection('products').insertOne(this).then(result=>{
      console.log(result); 
    }).catch(err=>{
      console.log(err);
    })
    //db.save();
  }
}
module.exports = Product