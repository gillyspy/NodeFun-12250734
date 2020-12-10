const mongodb = require('mongodb');
const getDb = require('../util/db').getDb;

const cProps = [
  'title',
  'description',
  'url',
  'price',
  'id',
  'userid'
];

const assignProps = function (n, o) {
  cProps.forEach(k => {
    if (k === 'id') {
      n['_id'] = o[k];
    }
    n[k] = o[k];
  })
  return n;
}

class ProductShell {
  constructor(t, d = 'TBD', u, price, id = null, userid) {
    if (typeof t === 'object') {
      assignProps(this, t);
    } else {
      this.title = t;
      this.description = d;
      this.url = u;
      this.price = price;
      this._id = id;
      this.userid = userid
    }
    this['_id'] = this['_id'] || t._id || t._id || t.id
  }
}

class Product
  extends ProductShell {
  constructor(t, d = 'TBD', u, price, id = null, userid) {
    super(t, d = 'TBD', u, price, id = null, userid);
  }

  dbShadowWithId() {
    return new ProductShell(this);  //= new Product('ghost');
  }

  dbShadowWithoutId() {
    const _shadow = Object.assign({}, this.dbShadowWithId());
    delete _shadow._id;
    return _shadow;
  }

  save() {
    const db = getDb();
    let dbTran;
    if (this._id) {
      //update
      this.prepIdForDb();
      //this._id = new mongodb.ObjectId(this._id);
      dbTran = db.collection('products').updateOne(
        {
          _id: this._id
        },
        {
          $set: this.dbShadowWithoutId(),
        }
      );
    } else {
      dbTran = db.collection('products').insertOne(this.dbShadowWithoutId());
    }
    return dbTran
      .then((result) => {
        return result;
        //console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  prepIdForDb() {
    //return
    return Product.prepIdForDb(this);
  }

  static prepIdForDb(objOrId) {
    // this will get called statically no matter what, but the object might be
    // an instance of Product (see prototype for prepIdForDb )
    // so check what `this` is
    if (typeof objOrId === 'object' && objOrId instanceof Product) {
      if (typeof objOrId._id !== 'object') {
        objOrId._id = mongodb.ObjectId(objOrId._id);
      }
      return objOrId;
    } else if (typeof objOrId._id === 'object') {
      return objOrId._id
      //already BSON id already
    } else {
      return mongodb.ObjectId(objOrId);
    }
  }

  static compareProducts(p1, p2 = null) {
    if (p1 === p2) {
      return true;
    } else if (p2 === null) {

      //p1 is the other product and `this` is reference product
      return thisp1._id.toString() === this._id.toString()
    } else {
      return p1._id.toString() === p2._id.toString();
    }
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((results) => {
        console.log(results);
        results.forEach(r => {
          r = new Product(r)
        });
        return results;
      })
      .catch((err) => {
        console.log('Error in fetchAll', err);
      }); /* */
  }

  static find(obj) {
    const db = getDb();
    const {_id, userid, ..._obj} = obj;
    if (userid) {
      let _userid = mongodb.ObjectId(userid)
      _obj.userid = _userid
    }
    return db.collection('products').find(_obj).toArray().then(products => {
      products.forEach(p => {
        p = new Product(p)
      })
      return products;
    }).catch(err => {
      console.log('problem finding products')
    });
  }

  static findById(id) {
    const db = getDb();
    id = mongodb.ObjectId(id);
    return db
      .collection('products')
      .find({_id: id})
      .next()
      .then((result) => {
        if (!result) {
          return null;
        } else {
          const p = new Product(result);
          return p;
        }
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteOne(obj) {
    const db = getDb();
    return db.collection('products').deleteOne( obj )
      .then(() => {
        console.log('Deleted!');
      }).catch(err => {
        console.log(err);
      });
  }
}

module.exports = Product;

