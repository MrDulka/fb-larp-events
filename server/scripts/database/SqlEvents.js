const Event = require('./Event.js');
const Events = require('../service/Events');

/**
 * This class represents Events in the postgreSQL database.
 */

class SqlEvents extends Events {

    /**
     * Create SqlEvents
     * @param {Object} pgPool - represents sql connection pool
     * @param logger
     */
    constructor(pgPool, logger) {
        super();

        this._pgPool = pgPool;
        this._logger = logger;
    }

    /**
     * Save the event into the database, if it is not already there
     * @param {Event} event - Event to be stored in the database
     */
    save(event) {
        this._logger.info(`SqlEvents#save Event: `, event);

        const web = event.web;
        let selectSql = `SELECT * FROM public.event WHERE web = '${web}'`;

        let insertSql = `INSERT INTO public.event
            (name, description, loc, source, "from", "to", latitude, longitude, web, added_by, amoutOfPlayers, language)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `;
        let values = [event.name, event.description, event.location.name, event.source, event.date.start_date, event.date.end_date,
            event.location.latitude, event.location.longitude, web, 1, event.amountOfPlayers, event.language];

        this._pgPool.query(selectSql).then(result => {
            if (result.rows.length > 0) {
                return null;
            } else {
                return this._pgPool.query(insertSql, values);
            }
        }).catch(err => {
            this._logger.error(`SqlEvents#save Error:`, err);
        });
    }


    /**
     * Load all events from the database
     * @return {Promise|Event[]} - resolves with array of events in the database
     */
    load() {
        this._logger.info(`SqlEvents#load`);

        let selectSql = `SELECT * FROM public.event`;
        return this._pgPool.query(selectSql).then(result => {
            return this.convert(result);
        }).catch(err => {
            this._logger.error(`SqlEvents#load Error`, err);
        });
    }

    /**
     * Converts events to instances of Event class
     * @param {Object[]} events - array of events as received from database
     * @return {Event[]} - array of Events
     */
    convert(events) {
        return events.rows.map(event => {
            let date = {
                start_date: new Date(event.from.toISOString()),
                end_date: new Date(event.to.toISOString())
            };
            let location = {
                latitude: event.latitude,
                longitude: event.longitude,
                name: event.loc
            };
            return new Event(event.name, event.description, date, location, event.web, 'LarpDb', amountOfPlayers, language);
        });
    }
}

module.exports = SqlEvents;
