let Event = require('../database/Event');
let Events = require('./Events');

/**
 * This class loads events from the HrajLarp database.
 * @augments Events
 */
class HrajLarpEvents extends Events {
    constructor(pgPool, logger) {
        super();

        this._pgPool = pgPool;
        this._logger = logger;
    }

    /**
     * @inheritDoc
     */
    save(event) {
        throw new Error('HrajLarpEvents#save It is read only data source.');
    }

    /**
     * @inheritDoc
     */
    load() {
        this._logger.info(`HrajLarpEvents#load`);

        return this._pgPool.query(`SELECT * FROM game WHERE date > now()`).then(result => {
            return this.convert(result.rows);
        })
        .catch(err => {
            this._logger.error(`HrajLarpEvents#load Error:`, err);
        });
    }

    /**
     * Converts events to instances of Event class
     * @param {Object[]} events Events retrieved from the database
     * @return {Event[]} - array of Events
     */
    convert(events) {
        return events.map(event => {
            let amountOfPlayers = Number(event.men_role) + Number(event.women_role) + Number(event.both_role);
            let source = 'HrajLarp';
            let date = {
                start_date: new Date(event.date),
                end_date: new Date(event.date)
            };
            let location = {
                latitude: null,
                longitude: null,
                name: event.place
            };
            return new Event(event.name, event.anotation, date, location, `https://hrajlarp.cz/game/detail?gameId=${event.id}`, source, amountOfPlayers, 'cz');
        });
    }
}

module.exports = HrajLarpEvents;
