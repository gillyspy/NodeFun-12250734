const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

/*****************/
/***** database config ***/
const options = require('./options');
const dbConfig = options.configOptions.db;
let _db;

const mongoConnect = (callback) => {
  const uri =
    'mongodb+srv://'+dbConfig.username+':'+dbConfig.password+'@'+dbConfig.host+'/shop?retryWrites=true&w=majority';
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  client
    .connect()
    .then((client) => {
      console.log('Connected');
      _db = client.db()
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
      //const collection = client.db('test').collection('devices');
      // perform actions on the collection object
      //client.close();
    });
};

const getDb = ()=>{
  if( _db ){
    return _db; 
  }
  throw 'No database found!';
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;