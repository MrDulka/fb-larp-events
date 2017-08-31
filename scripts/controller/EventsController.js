/**
 * Class representing a controller for the events
 */
class EventsController{
  /**
   * Create a controller
   * Route HTTP GET requests to "/event" with the load method
   * Route HTTP POST requests to "/event" with the store method
   * @param {Application} app - Express Application
   * @param {Events} events - instance of Events class, used for working with database
   */
  constructor(app, events) {
    app.get('/event', this.load.bind(this));
    app.post('/event', this.store.bind(this));
    this._events = events;
  }

  /**
   * Loads events and sends them in response in JSON format
   */
  load(request, response){
    this._events.load().then(events =>{
      response.json({
        events: events
      });
    }).catch(error => {
      response.status(500).json();
    });
  }

  /**
   * Should store the event received in the request
   * TODO: After receiving the request, should it filter/trim/validate the data
   * provided in the request?
   * Should it instantiate an object of the Event class and pass that to
   * events?
   */
  store(request, response){

  }

}

module.exports = EventsController;
