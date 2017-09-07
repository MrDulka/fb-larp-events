const express = require('express');
const fs = require('fs');
const app = express();
const MongoEvents = require('../database/MongoEvents.js');
const SqlEvents = require('../database/SqlEvents.js');
const FbEvents = require('../service/FbEvents.js');
const ScheduledEvents = require('../service/ScheduledEvents.js');
const EventsController = require('../controller/EventsController.js');

class WebApplication{
  constructor(databases){
    this._mongoDB = databases[0];
    this._pgPool = databases[1];
  }
  setup(){
    app.set('port', (process.env.PORT || 5000));
    app.listen(app.get('port'));

    const mongoEvents = new MongoEvents(this._mongoDB);
    const sqlEvents = new SqlEvents(this._pgPool);

    const fbEvents = new FbEvents();
    const scheduledEvents = new ScheduledEvents(fbEvents, sqlEvents);

    scheduledEvents.schedule();

    const controller = new EventsController(app, sqlEvents);

    this.clientside();
  }

  clientside(){
    app.set('views', __dirname + "/../../views");
    app.set('view engine', 'ejs');

    app.get('/', function(req, res){
      res.render("index");
    });

    app.get('/clientscript.js', function (req, res){
      const script = fs.readFileSync(app.get('views') + "/clientscript.js", "utf8");
      res.end(script);
    });
  }

}

module.exports = WebApplication;
