const MongoClient = require('mongodb').MongoClient;
const { Pool } = require('pg');

class DataStores{
  constructor(mongoURL, sqlURL){
    this._mongoURL = mongoURL;
    this._sqlURL = sqlURL;
  }
  setup(){
    const mongo = MongoClient.connect(this._mongoURL);
    const pool = new Pool({connectionString: this._sqlURL});

    return Promise.all([mongo, pool]);

  }
}

module.exports = DataStores;
