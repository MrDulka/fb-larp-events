const express = require('express');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const Event = require('./scripts/database/Event.js');
const Events = require('./scripts/database/MongoEvents.js');
const EventsController = require('./scripts/controller/EventsController.js');

const FbEvents = require('./scripts/service/FbEvents.js');

const app = express();
const dbURL = 'mongodb://localhost:27017/test';

app.set('port', (process.env.PORT || 5000));

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');


MongoClient.connect(dbURL).then((database) => {

  const events = new Events(database);

  const controller = new EventsController(app, events);

}).catch((error) => console.log(error));

app.get('/test', function(req, res){
  const fbEvents = new FbEvents();
  fbEvents.load().then(events => {
      console.log(events.length);
      res.end(JSON.stringify(events));
  });

});


app.get('/', function(req, res){
  res.render("index");
});

app.get('/clientscript.js', function (req, res){
  const script = fs.readFileSync("./views/clientscript.js", "utf8");
  res.end(script);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
