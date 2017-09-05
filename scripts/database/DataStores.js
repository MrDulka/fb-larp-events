const MongoClient = require('mongodb').MongoClient;

class DataStores{
  constructor(mongoURI){
    this._mongoURI = mongoURI;
  }
  setup(){
    return MongoClient.connect(this._mongoURI);
  }
}

module.exports = DataStores;
