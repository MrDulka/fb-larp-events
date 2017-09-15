var fetch = require('node-fetch');
var FbSearch = require('./FbSearch.js');
var EventsFormatter = require('./EventsFormatter.js');

let Events = require('./Events');

/**
 * Class for getting events from Facebook
 * @augments Events
 */
class FbEvents extends Events {
    constructor(){
      super();

      this._accessToken = "EAAO1Gik9JWQBAEOTDe26hxuCGgvZAsVTcZBZBws5izC36yyEY9JLwdpXprKIcxq9nYRTrRBnrpwPWUKvKZAa0UmLG1jrjaZCKI48umheRxYIsiXjPLjhCWi2rjMDU34ScvRpWSagmmyMa5YLNHETe6rgKyqKhVQY5GBIZCwL8FuQZDZD";
      this._pagesSearch = "https://graph.facebook.com/search?q=larp&type=page&access_token=" + this._accessToken;
      this._groupsSearch = "https://graph.facebook.com/search?q=larp&type=group&access_token=" + this._accessToken;
      this._fbSearch = new FbSearch();
      this._eventsFormatter = new EventsFormatter();
    }

    /**
     * @inheritDoc
     * loads events
     * @return {Promise} promise that resolves with an array of events that we
     * received from Facebook, formatted as instances of Event class
     */
    load(){
      return new Promise((resolve, reject) => {
        const groupsPromise = this._fbSearch.loadIds(this._groupsSearch);
        const pagesPromise = this._fbSearch.loadIds(this._pagesSearch);

        Promise.all([groupsPromise, pagesPromise]).then(idsArray => {
          return idsArray[0].concat(idsArray[1]);
        })
        .then(ids => {
          return this.getEvents(ids);
        })
        .then(data => {
          return this._eventsFormatter.format(data);
        })
        .then(events => {
          resolve(events);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
      });
    }

    /**
     * Splits ids into chunks that facebook api can hadle (size 25)
     * and requests data for events of pages/groups with specified ids
     * @param {string[]} ids - array of strings, ids of facebook pages/groups
     * @return {Promise} promise that resolve with an array of data responses
     * from Facebook
     */
    getEvents(ids){
      return new Promise((resolve, reject) => {
        var idArray = ids;
        var iterations = Math.ceil(idArray.length / 25);
        var promises = [];

        for (let i=0; i<iterations; i++){
          var idString = idArray.splice(-25).join(",");
          var searchUrl = "https://graph.facebook.com/events?ids=" +
                          idString + "&access_token=" + this._accessToken;
          var prom = this._fbSearch.getUrl(searchUrl);
          promises.push(prom);
        }
        Promise.all(promises).then(data => resolve(data));
      });
    }
}

module.exports = FbEvents;
