/**
 * Class representing a controller for the events
 */
class EventsController {
    /**
     * Creates a controller
     * Routes HTTP GET requests to "/event" with the load method
     * @param {Application} app - Express Application
     * @param {Events} events - instance of Events class, used for working with database
     */
    constructor(app, events) {
        app.get('/event', this.load.bind(this));

        this._events = events;
    }

    /**
     * Loads events and sends them in response in JSON format
     */
    load(request, response) {
        this._events.load().then(events => {
            response.json({
                events: events
            });
        }).catch(error => {
            response.status(500).json();
        });
    }

}

module.exports = EventsController;
