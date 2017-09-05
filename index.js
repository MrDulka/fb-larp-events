const express = require('express');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const Event = require('./scripts/database/Event.js');
const MongoEvents = require('./scripts/database/MongoEvents.js');
const FbEvents = require('./scripts/service/FbEvents.js');
const ScheduledEvents = require('./scripts/service/ScheduledEvents.js');
const EventsController = require('./scripts/controller/EventsController.js');

const app = express();
const dbURL = 'mongodb://localhost:27017/test';

app.set('port', (process.env.PORT || 5000));

MongoClient.connect(dbURL).then((database) => {
  const mongoEvents = new MongoEvents(database);
  const fbEvents = new FbEvents();

  const scheduledEvents = new ScheduledEvents(fbEvents, mongoEvents);

  scheduledEvents.schedule();

  const controller = new EventsController(app, mongoEvents);

}).catch((error) => console.log(error));


/**
 * client side, to be removed soon
 */
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render("index");
});

app.get('/clientscript.js', function (req, res){
  const script = fs.readFileSync("./views/clientscript.js", "utf8");
  res.end(script);
});


app.listen(app.get('port'));
