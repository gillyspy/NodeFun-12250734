const mongodb = require('mongodb');
const getDb = require('../util/db').getDb;

class User{

  constructor(username, email,id=null){
     this.username = username;
    this.email = email;
    this.id = id; 

  }

  save(){
    const db = getDb();
    this.id = new mongodb.ObjectId(this.id); 
    return db.collection('users').insertOne( this );
  }

  static findById(userId){
    const db = getDb();
    userId = new mongodb.ObjectId(userId);
    return db.collection('users').findOne({ _id : userId })
  }
}

module.exports = User;