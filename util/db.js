const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  const uri =
    'mongodb+srv://mongdb:7eKlNjxGt284@cluster0.dpwco.mongodb.net/<dbname>?retryWrites=true&w=majority';
  const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true });
  client.connect((err) => {
    callback( client );
    //const collection = client.db('test').collection('devices');
    // perform actions on the collection object
    //client.close();
  });
};

module.exports = mongoConnect; 