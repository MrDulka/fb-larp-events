const FbSearch = require('./FbSearch.js');
const EventsFormatter = require('./EventsFormatter.js');

const Events = require('./Events');

/**
 * Class for getting events from Facebook
 * @augments Events
 */
class FbEvents extends Events {
    constructor(logger) {
        super();

        this._logger = logger;
        this._fbSearch = new FbSearch(logger);
        this._eventsFormatter = new EventsFormatter();
    }

    /**
     * @inheritDoc
     */
    save(event) {
        throw new Error('FbEvents#save It is read only data source.');
    }

    /**
     * @inheritDoc
     * loads events
     * @return {Promise} promise that resolves with an array of events that we
     * received from Facebook, formatted as instances of Event class
     */
    load() {
        const result = this._fbSearch.searchAll([ {query: 'larp', type:'page'},
        {query: 'larp', type:'event'}, {query: 'larp', type:'group'}]);

        return result.then(events => {
            return this._eventsFormatter.format(events);
        }).catch(err => {
            this._logger.error(`FbEvents#load Error`, err);
        });
    }

}

module.exports = FbEvents;
