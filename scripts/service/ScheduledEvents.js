/**
 * class for scheduling of regular loads into the database
 */

class ScheduledEvents {
    /**
     * @return {number} miliseconds in one hour
     */
    static HOUR() {
      return 60 * 60 * 1000;
    }

    /**
     * @param {Object} inputEvents instance of class for getting the events
     * @param {Object} serializeEvents instance of class for saving the events in database
     */
    constructor(inputEvents, serializeEvents) {
        this._timer = null;
        this._HOUR = 60 * 60 * 1000
        this._inputEvents = inputEvents;
        this._serializeEvents = serializeEvents;
    }

    /**
     * load events using the inputEvents class
     * and then store them using the serializeEvents class
     */
    load() {
        this._inputEvents.load().then(events => {
            events.forEach(event => {
              this._serializeEvents.save(event);
            });
        });
    }

    /**
     * schedule regular calls of the load method
     */
    schedule() {
        this.stop();
        this._timer = setInterval(this.load.bind(this), ScheduledEvents.HOUR());
        this.load();
    }

    /**
     * stop the timer
     */
    stop() {
      clearInterval(this._timer);
    }
}

module.exports = ScheduledEvents;
