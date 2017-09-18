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
        this._accessToken = "EAAO1Gik9JWQBAEOTDe26hxuCGgvZAsVTcZBZBws5izC36yyEY9JLwdpXprKIcxq9nYRTrRBnrpwPWUKvKZAa0UmLG1jrjaZCKI48umheRxYIsiXjPLjhCWi2rjMDU34ScvRpWSagmmyMa5YLNHETe6rgKyqKhVQY5GBIZCwL8FuQZDZD";
        this._pagesSearch = "https://graph.facebook.com/search?q=larp&type=page&access_token=" + this._accessToken;
        this._groupsSearch = "https://graph.facebook.com/search?q=larp&type=group&access_token=" + this._accessToken;
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
        const groupsPromise = this._fbSearch.loadIds(this._groupsSearch);
        const pagesPromise = this._fbSearch.loadIds(this._pagesSearch);

        return Promise.all([groupsPromise, pagesPromise]).then(idsArray => {
            return idsArray[0].concat(idsArray[1]);
        }).then(ids => {
            return this.getEvents(ids);
        }).then(data => {
            return this._eventsFormatter.format(data);
        }).catch(err => {
            this._logger.error(`FbEvents#load Error`, err);
        });
    }

    /**
     * Splits ids into chunks that facebook api can hadle (size 25)
     * and requests data for events of pages/groups with specified ids
     * @param {string[]} ids - array of strings, ids of facebook pages/groups
     * @return {Promise} promise that resolve with an array of data responses
     * from Facebook
     */
    getEvents(ids) {
        let idArray = ids;
        let iterations = Math.ceil(idArray.length / 25);
        let promises = [];

        for (let i = 0; i < iterations; i++) {
            let idString = idArray.splice(-25).join(",");
            let searchUrl = "https://graph.facebook.com/events?ids=" +
                idString + "&access_token=" + this._accessToken;
            let prom = this._fbSearch.getUrl(searchUrl);
            promises.push(prom);
        }
        return Promise.all(promises);
    }
}

module.exports = FbEvents;
