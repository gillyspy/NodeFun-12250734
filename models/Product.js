const mongodb = require('mongodb');
const getDb = require('../util/db').getDb;

class Product {
  constructor(t, d = 'TBD', u, price, id=null) {
    this.title = t;
    this.description = d;
    this.url = u;
    this.price = price;
    this._id = id
  }

  save() {
    const db = getDb();
    let dbTran;
    if (this._id) {
      //update
      this._id = new mongodb.ObjectId(this._id);
      dbTran = db.collection('products').updateOne(
        {
          _id: this._id,
        },
        {
          $set: this,
        }
      );
    } else {
      dbTran = db.collection('products').insertOne(this);
    }
    return dbTran
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }


  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((results) => {
        console.log(results);
        return results;
      })
      .catch((err) => {
        console.log('Error in fetchAll', err);
      }); /* */
  }
  static findById(id) {
    const db = getDb();
    id = mongodb.ObjectId(id);
    return db
      .collection('products')
      .find({_id: id})
      .next()
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static deleteById(id){
    const db = getDb();
    id = mongodb.ObjectId(id)
    return db.collection('products').deleteOne({ _id : id})
    .then( ()=>{
      console.log('Deleted!');
    }).catch(err=>{
      console.log(err);
    });
  }
}
module.exports = Product;
