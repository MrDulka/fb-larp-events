module.exports = function getEvents() {
  var mongodb = require('mongodb');
  var uri = 'mongodb://localhost:27017/test';

  return mongodb.MongoClient.connect(uri).then(function(db){
    return db.collection('events').find().toArray();
  }).then(function (events){
    return events;
  }).catch(function (error){
    console.log(error);
    process.exit(1);
  });

}
