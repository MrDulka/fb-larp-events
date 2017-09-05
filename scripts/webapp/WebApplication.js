const express = require('express');
const fs = require('fs');
const app = express();
const MongoEvents = require('../database/MongoEvents.js');
const FbEvents = require('../service/FbEvents.js');
const ScheduledEvents = require('../service/ScheduledEvents.js');
const EventsController = require('../controller/EventsController.js');

class WebApplication{
  constructor(mongoDB){
    this._mongoDB = mongoDB;
  }
  setup(){
    app.set('port', (process.env.PORT || 5000));
    app.listen(app.get('port'));

    this._mongoDB.setup().then((database) =>{
      const mongoEvents = new MongoEvents(database);
      const fbEvents = new FbEvents();
      const scheduledEvents = new ScheduledEvents(fbEvents, mongoEvents);

      scheduledEvents.schedule();

      const controller = new EventsController(app, mongoEvents);
    }).catch((error) => console.log(error));

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
