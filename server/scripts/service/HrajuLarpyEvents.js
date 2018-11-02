let Event = require('../database/Event');
let Events = require('./Events');
let fetch = require('node-fetch');
let sanitizeHtml = require('sanitize-html');

/**
 * This class loads events from Hraju Larpy
 * @augments Events
 */

class HrajuLarpyEvents extends Events{
    /**
     * Creates HrajLarpEvents
     * @param logger - logger for logging
     */
    constructor(logger){
        super();

        this._logger = logger;
    }

    /**
     * @inheritDoc
     */
    save(event) {
        throw new Error('HrajuLarpyEvents#save It is read only data source.');
    }

    /**
     * @inheritDoc
     */
    load() {
        this._logger.info(`HrajuLarpyEvents#load`);

        const url = 'https://hrajularpy.cz/api-events.php';

        return fetch(url)
        .then(response => response.json())
        .then(data => {
          return this.convert(data.results);
        })
        .catch(err => {
          this._logger.error('HrajuLarpyEvents#load Error: ', err)
        });
    }

    /**
     * Converts events to instances of Event class
     * @param {Object[]} events Events retrieved from the database
     * @return {Event[]} - array of Events
     */
    convert(events) {
        return events.map(event => {
            let source = 'HrajuLarpy';
            let description = sanitizeHtml(event.description, {allowedTags: [], allowedAttributes: []});
            let date = {
              start_date: new Date(event.start),
              end_date: new Date(event.end)
            };
            let location = {
              latitude: event.latitude || null,
              longitude: event.longitude || null,
              name: event.location
            };
            return new Event(event.name, description, date, location, event.website, source, event.capacity, 'cz');
        });
    }
}

module.exports = HrajuLarpyEvents;
