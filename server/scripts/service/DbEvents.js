const Events = require('./Events');
const SqlEvents = require('../database/SqlEvents');
const SqlEventLabel = require('../database/SqlEventLabel');
const SqlGameEvent = require('../database/SqlGameEvent');
const WantedEmail = require('./mail/WantedEmail');

/**
 * Class stores events in the database
 * @augments Events
 */

class DbEvents extends Events{
    constructor(pgPool, logger){
        super();

        this._pgPool = pgPool;
        this._logger = logger;

        const sqlEventLabel = new SqlEventLabel(pgPool, logger);
        const sqlGameEvent = new SqlGameEvent(pgPool, logger);
        this._sqlEvents = new SqlEvents(pgPool, logger, sqlEventLabel, sqlGameEvent);
    }

    /**
     * @inheritDoc
     */
    save(event){
        return this._sqlEvents.save(event);
    }

    /**
     * @inheritDoc
     */
    load(){
        return this._sqlEvents.load();
    }
}

module.exports = DbEvents;
