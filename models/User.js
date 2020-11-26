const mongodb = require('mongodb');
const getDb = require('../util/db').getDb;

class User {

  constructor(username, email, id = null, cart) {
    this.username = username;
    this.email = email;
    this._id = id;
    this.cart = cart;
  }

  save() {
    const db = getDb();
    this.id = new mongodb.ObjectId(this.id);
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    this._id = new mongodb.ObjectId(this._id);
    /*const cartProduct = this.cart.items.findIndex(item => {
      if (item._id === product._id) {
        //already exists in the cart
        // update qty
      } else {
        //pure add

      }
    }); /**/
    const updatedCart = {
      items: [{
        ...product,
        quantity: 1
      }]
    };

    const db = getDb();
    db.collection('users').updateOne(
        {
          _id: this._id
        },
        {
          $set: {cart: updatedCart}
        }
    );
  } //addToCart

  static findById(userId) {
    const db = getDb();
    userId = new mongodb.ObjectId(userId);
    return db.collection('users').findOne({_id: userId})
  }
}

module.exports = User;