const mongodb = require('mongodb');
const getDb = require('../util/db').getDb;
const bcrypt = require('bcryptjs');

class User {

  constructor(username, email, id = null, cart = {
    items     : [],
    totalPrice: 0
  }, resetToken = null, resetTokenExpiration) {
    this.username = username;
    this.email = email;
    this._id = id;
    this.cart = cart;
    //this.resetToken = resetToken;
    //this.resetTokenExpiration= resetTokenExpiration;
  }

  save(password, operation) {
    const db = getDb();
    var updatedUser={};
    switch(true) {
      case (password && operation === 'reset'):
        //update of password
        updatedUser._id = new mongodb.ObjectId(this._id);
        updatedUser.$unset = {
          resetToken          : "",
          resetTokenExpiration: 1
        }
        return bcrypt.hash(password, 12).then(password => {
          updatedUser.$set = {password: password}
          const { _id,... _user } =  updatedUser
//          console.log(updatedUser, _user )
          return db.collection('users').updateOne({
            _id : updatedUser._id
          }, _user );
        });
        break;
      case !!password :
        //insert
        updatedUser._id = new mongodb.ObjectId(updatedUser._id);
        this._id = updatedUser._id
        return bcrypt.hash(password, 12).then(password => {
          this.password = password;
          return db.collection('users').insertOne(this);
        })
      break;
      default:

      updatedUser = {...this}
      const { _id, ... _user } = updatedUser;
      //update otherwise
      return db.collection('users').updateOne(  {
          _id: this._id
        },
        {
          $set: _user
        } );
      break;
    }//switch
  }

  checkPassword( password ){
    const db = getDb();
    const userId = new mongodb.ObjectId(this._id);
    return db.collection('users').findOne({_id: userId}).then(user => {
      return bcrypt.compare( password, user.password );
    });
  }

  addToCart(product) {
    this._id = new mongodb.ObjectId(this._id);
    const updatedCart = this.cart;
    let isMissing = true;
    //look in existing cart
    this.cart.items.forEach(item => {
      if (item.productId.toString() === product._id.toString()) {
        item.quantity++;
        item.price = +product.price;
        updatedCart.totalPrice+= +product.price;
        isMissing = false;
        // update qty
      }
    });
    if (isMissing) {
      // was missing => add it
      updatedCart.items.push({
        productId: new mongodb.ObjectId(product._id),
        price : +product.price,
        quantity : 1
      });
      updatedCart.totalPrice+= +product.price;
    }
    console.log(updatedCart);

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


  addOrder() {
    const db = getDb();

    return this.getCart().then(products => {
      //add cart products to the order db
      products.forEach((product, i, a) => {
        let {description: _, url: __, userid: ___, ...temp_order} = product;
        a[i] = temp_order;
      });
      console.log(products);

      const temp_order = {
        items: products,
        user : {
          _id     : mongodb.ObjectId(this._id),
          username: this.username,
          email   : this.email
        }
      };
      //migrate cart into orders
      return db.collection('orders').insertOne(temp_order)
    }).then(result => {
      //reset the cart in the session
      this.cart = {items : []};
      //reset user's cart in the database
      return db.collection('users')
          .updateOne({
            _id: mongodb.ObjectId(this._id)
          }, {
            $set: {cart: this.cart}
          });
    });
  }

  getOrders() {
    const db = getDb();

    return db.collection('orders').find({
      user: {
        _id     : mongodb.ObjectId(this._id),
        username: this.username,
        email   : this.email
      }
    }).toArray();
  }

  static findOne( obj ){
    const db = getDb();
    //this.userId = new mongodb.ObjectId(userId);
    return db.collection('users').findOne( obj ).then(user => {
      if( user ) {
        return new User(user.username, user.email, user._id, user.cart);
      } else {
        return null
      }
    })
  }

  static findById(userId) {
    const db = getDb();
    userId = new mongodb.ObjectId(userId);
    return db.collection('users').findOne({_id: userId}).then(user => {
      return new User(user.username, user.email, user._id, user.cart);
    })
  }

  static findByEmail(email, password = null) {
    const db = getDb();
    const searchObj = {email: {$eq: email}};
    /*if( password ){
      searchObj.password = {$eq : password};
    }*/
    return db.collection('users').findOne(searchObj).then(user => {
      console.log(user);
      if (user === null) {
        return user;
      } else {
        return new User(user.username, user.email, user._id, user.cart);
      }
    })
  }
}

module.exports = User;