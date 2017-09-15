/**
  * This class represents Events in the Mongo DB store.
  */

class MongoEvents {
  /**
   * Create MongoEvents
   * @param {Object} database - represents the database to which it is connected
   */
  constructor(database){
    this._database = database;
  }

  /**
   * loads all events from the database
   * @return {Promise} - resolves with Array of events in the database
   */
  load(){
    return this._database.collection('events').find().toArray();
  }

  /**
   * saves one event in the database, if it is not already there
   * if it is already there - found by fbId - updates other fields
   * @param {Event} event - Event to store in the database
   * @return {Promise}
   */
  save(event){
    return this._database.collection('events').update(
      {fbId: event.fbId},
      event.json(),
      {upsert: true}
    );
  }

  /**
   * clear the database
   */
  clear(){
    this._database.collection('events').remove();
  }
}

module.exports = MongoEvents;
