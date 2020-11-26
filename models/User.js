const mongodb = require('mongodb');
const getDb = require('../util/db').getDb;

class User {

  constructor(username, email, id = null, cart = {
    items     : [],
    totalPrice: 0
  }) {
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
    const updatedCart = this.cart;
    let isMissing = true;
    //look in existing cart
    const cartProduct = this.cart.items.findIndex(item => {
      if (item.productId.toString() === product._id.toString()) {
        item.quantity++;
        isMissing = false;
        return;
        // update qty
      }
    });
    if (isMissing) {
      // was missing => add it
      updatedCart.items.push({
        productId: new mongodb.ObjectId(product._id),
        quantity : 1
      });
    }

    const db = getDb();
    return db.collection('users').updateOne(
        {
          _id: this._id
        },
        {
          $set: {cart: updatedCart}
        }
    );
  } //addToCart

  getCart() {
    //return a list of items that are in the cart.  Show their quantity
    const productIds = this.cart.items.map(item => {
      return mongodb.ObjectId(item.productId)
    });

    const db = getDb();
    return db.collection('products').find({_id: {$in: productIds}}).toArray().then(products => {
      //add the cart-based-quantity to each product
      return products.map(product => {
        product.quantity = this.cart.items
            .find(item => item.productId.toString() === product._id.toString())
            .quantity;
        return product;
      });

    });
  }

  deleteItemFromCart(productId) {
    this.cart.items = this.cart.items.filter(item => {
      return (productId.toString() !== item.productId.toString());
    })

    const db = getDb();
    return db.collection('users')
        .updateOne({
          _id: mongodb.ObjectId(this._id)
        }, {
          $set: {cart: this.cart}
        });
  }

  static findById(userId) {
    const db = getDb();
    userId = new mongodb.ObjectId(userId);
    return db.collection('users').findOne({_id: userId})
  }
}

module.exports = User;