class Events {
  constructor(database){
    this._database = database;
  }
  load(){
    return this._database.collection('events').find().toArray();
  }
  save(event){
    return this._database.collection('events').insertOne(event);
  }
}

module.exports = Events;
