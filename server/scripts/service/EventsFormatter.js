const Event = require('../database/Event.js');
const franc = require('franc');
const _ = require('underscore');

/**
 * Class for formatting events
 */
class FormatEvents {
    /**
     * @param {Object[]} data - array of objects received and put together from FB
     * @return {Event[]} events - array of Events
     */
    format(data) {
        let events = this.filterFuture(data);
        events = this.filterCzechOnly(events);
        events = this.filterLarpRelated(events);
        events = this.filterDuplicates(events);
        events = this.classify(events);
        return events;
    }

    /**
     * Filters events, only those happening in the future remain
     * @param {Object[]} events - array of objects
     * @return {Object[]} - array of objects, filtered
     */
    filterFuture(events) {
        return events.filter(event => {
            let now = new Date();
            let startTime = new Date(event.start_time);
            return now < startTime;
        });
    }

    /**
     * Filters out events that are not Czech - do not have description in Czech language
     */
    filterCzechOnly(events) {
        return events.filter(event => {
            return (franc(event.description) === 'ces');
        });
    }

    /**
     * Filters out events that are not larp related
     */
    filterLarpRelated(events) {
        return events.filter(event => {
            return (event.name.indexOf('larp') > -1 || event.description.indexOf('larp') > -1);
        });
    }

    /**
     * Filters out duplicates
     */
    filterDuplicates(events) {
        return _.uniq(events, (event) => {
            return event.id;
        });
    }

    /**
     * Makes the received events into instances of the Event class
     * @param {Object[]} events - array of objects localized
     * @return {Event[]}  - array of events
     */
    classify(events) {
        return events.map(event => {
            let name = event.name;
            let description = event.description;
            let date = {
                start_date: event.start_time,
                end_date: event.end_time
            };

            let latitude = null;
            let longitude = null;
            let city = 'ČR';
            if (event.place && event.place.location) {
                latitude = event.place.location.latitude || null;
                longitude = event.place.location.longitude || null;
                city = event.place.location.city || 'ČR';
            }
            let location = {
                latitude: latitude,
                longitude: longitude,
                name: city
            };
            let web = `https://www.facebook.com/${event.id}`;

            return new Event(name, description, date, location, web, "Facebook");
        });
    }

}

module.exports = FormatEvents;
