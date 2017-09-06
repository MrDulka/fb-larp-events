/** Otázka na Baldu - metóda getUrl je rovnaká ako u triedy FbPages, môžem ju
použiť miesto definovania duplicitnej u FbEvents?
Alebo vytvoriť ďalšiu triedu od ktorej budú preberať obe?
*/

var fetch = require('node-fetch');
var FbPages = require('./FbPages.js');
var EventsFormatter = require('./EventsFormatter.js');

/**
 * Class for getting events from Facebook
 */
class FbEvents {
    constructor(){
      this._accessToken = "EAAO1Gik9JWQBAEOTDe26hxuCGgvZAsVTcZBZBws5izC36yyEY9JLwdpXprKIcxq9nYRTrRBnrpwPWUKvKZAa0UmLG1jrjaZCKI48umheRxYIsiXjPLjhCWi2rjMDU34ScvRpWSagmmyMa5YLNHETe6rgKyqKhVQY5GBIZCwL8FuQZDZD";
      this._fbPages = new FbPages();
      this._eventsFormatter = new EventsFormatter();
    }

    /**
     * loads events
     * @return {Promise} promise that resolves with an array of events that we
     * received from Facebook, formatted as instances of Event class
     */
    load(){
      return new Promise((resolve, reject) => {
        this._fbPages.loadIds()
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
     * and requests data for events of the facebook pages with specified ids
     * @param {string[]} ids - array of strings, ids of facebook pages related to larp
     * @return {Promise} promise that resolve with an array of data responses from Facebook
     */
    getEvents(ids){
      return new Promise((resolve, reject) => {
        var idArray = ids;
        var iterations = Math.ceil(idArray.length / 25);
        var promises = [];

        for (let i=0; i<iterations; i++){
          var idString = idArray.splice(-25).join(",");
          var searchUrl = "https://graph.facebook.com/events?ids=" + idString + "&access_token=" + this._accessToken;
          var prom = this.getUrl(searchUrl);
          promises.push(prom);
        }
        Promise.all(promises).then(data => resolve(data));
      });
    }

    /**
     * Make a call to specified url to get data
     * @param {string} url
     * @return {Promise} promise that resolves to an object with returned data
     */
    getUrl(url){
      return new Promise((resolve, reject) => {
        fetch(url)
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(err => {
          console.log(err);
          reject(err);
        });
      });
    }

}

module.exports = FbEvents;
