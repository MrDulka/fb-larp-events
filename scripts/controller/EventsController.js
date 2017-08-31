class EventsController{
  constructor(app, events) {
    app.get('/event', this.load.bind(this));
    app.post('/event', this.store.bind(this));
    this._events = events;
  }
  load(request, response){
    this._events.load().then(events =>{
      response.json({
        events: events
      });
    }).catch(error => {
      response.status(500).json();
    });
  }
  store(request, response){
  }

}

module.exports = EventsController;
