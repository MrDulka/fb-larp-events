/**
 * Class representing an Event
 */
class Event {
    /** Creates an event
     * @param {string} name - name of the Event
     * @param {string} description - description of the Event
     * @param {Object} date - contains start and end dates of the Event
     * @param {Date} date.start_date - starting date and time of the Event
     * @param {Date} date.end_date - ending date and time of the Event
     * @param {Object} location - location of the Event
     * @param {string} location.name - name of the location
     * @param {number} location.latitude - latitude of the Event
     * @param {number} location.longitude - longitude of the Event
     * @param {String} web Full URL of the Event
     * @param {String} source - Source of the event.
     * @param amountOfPlayers {Number} Amount of the players of the game.
     * @param language {String} String representing the language of the event.
     */

    constructor(name, description, date, location, web, source, amountOfPlayers = 0, language = 'cz') {
        this._name = name;
        this._description = description;
        this._date = date;
        this._location = location;
        this._web = web;
        this._source = source;
        this._amountOfPlayers = amountOfPlayers;
        this._language = language;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get date() {
        return this._date;
    }

    get location() {
        return this._location;
    }

    get source() {
        return this._source;
    }

    get web() {
        return this._web;
    }

    get amountOfPlayers() {
        return this._amountOfPlayers;
    }

    get language() {
        return this._language;
    }

    set name(val) {
        this._name = val;
    }

    set description(val) {
        this._description = val;
    }

    set date(val) {
        this._date = val;
    }

    set location(val) {
        this._location = val;
    }

    set source(source) {
        this._source = source;
    }

    set web(web) {
        this._web = web;
    }

    set amountOfPlayers(players) {
        this._amountOfPlayers = players;
    }

    set language(language) {
        this._language = language;
    }

    json() {
        return {
            name: this.name,
            description: this.description,
            date: this.date,
            location: this.location,
            web: this.web,
            source: this.source,
            amountOfPlayers: this.amountOfPlayers,
            language: this.language
        }
    }
}

module.exports = Event;
