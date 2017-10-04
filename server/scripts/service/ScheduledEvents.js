const _ = require('underscore');

/**
 * Class for scheduling of regular loads into the database
 */
class ScheduledEvents {
    /**
     * @return {number} miliseconds in one hour
     */
    static HOUR() {
        return 60 * 60 * 1000;
    }

    /**
     * Creates ScheduledEvents
     * @param {Object[]} inputEvents instance of class for getting the events
     * @param {Object} serializeEvents instance of class for saving the events
     * in database
     * @param logger {Logger} Logger to be used.
     */
    constructor(inputEvents, serializeEvents, logger) {
        this._timer = null;
        this._inputEvents = inputEvents;
        this._serializeEvents = serializeEvents;

        this._logger = logger;
    }

    /**
     * Loads events using the inputEvents class
     * and then stores them using the serializeEvents class
     */
    load() {
        this._logger.info("ScheduledEvents#load Started loading events");
        return Promise.all(
            this._inputEvents.map(source => source.load())
        ).then(events => {
            let promise = Promise.resolve(null);
            _.flatten(events).forEach(event => {
                promise = promise.then(() => {
                    this._logger.info("ScheduledEvents#load Saving an event", event);
                    return this._serializeEvents.save(event);
                });
            });

            return promise;
        }).catch(err => {
            this._logger.error(`ScheduledEvents#load Error: `, err);
        });
    }

    /**
     * Schedules regular calls of the load method
     */
    schedule() {
        this.stop();
        this._timer = setInterval(this.load.bind(this), ScheduledEvents.HOUR());
        this.load();
    }

    /**
     * Stops the timer
     */
    stop() {
        clearInterval(this._timer);
    }
}

module.exports = ScheduledEvents;
