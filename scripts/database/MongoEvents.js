/**
  * This class represents Events in some store for example in the Mongo DB store.
  */

class Events {
  /**
   * Create Events
   * @param {Object} database - represents the database to which it is connected
   */
  constructor(database){
    this._database = database;
  }

  /**
   * loads all events from the database
   * @return {Promise} promise that resolves with Array of events in the database
   */
  load(){
    return this._database.collection('events').find().toArray();
  }
  /**
   * store one event to the database
   * @param {Event} event - Event to store in the database
   * @return {Promise} 
   */
  save(event){
    return this._database.collection('events').insertOne(event);
  }
}

module.exports = Events;
