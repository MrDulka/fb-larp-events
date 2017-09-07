const MongoClient = require('mongodb').MongoClient;
const { Pool } = require('pg');

/**
 * class representing the databases we use
 */

class DataStores{
  /**
   * initiate datastores with the provided links to databases
   */
  constructor(mongoURL, sqlURL){
    this._mongoURL = mongoURL;
    this._sqlURL = sqlURL;
  }
  /**
   * setup the databases, create connections to them
   * @return {Promise} promise that resolves with an array of databases
   */
  setup(){
    const mongo = MongoClient.connect(this._mongoURL);
    const pool = new Pool({connectionString: this._sqlURL});

    return Promise.all([mongo, pool]);
  }
}

module.exports = DataStores;
