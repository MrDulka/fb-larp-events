/** Otázka na Baldu - metóda getUrl je rovnaká ako u triedy FbPages, môžem ju
použiť miesto definovania duplicitnej u FbEvents?
Alebo vytvoriť ďalšiu triedu od ktorej budú preberať obe?
*/

var fetch = require('node-fetch');
var Event = require('../database/Event.js');
var FbPages = require('./FbPages.js');

/**
 * Class for getting events from Facebook
 */
class FbEvents {
    constructor(){
      this._accessToken = "EAAO1Gik9JWQBAEOTDe26hxuCGgvZAsVTcZBZBws5izC36yyEY9JLwdpXprKIcxq9nYRTrRBnrpwPWUKvKZAa0UmLG1jrjaZCKI48umheRxYIsiXjPLjhCWi2rjMDU34ScvRpWSagmmyMa5YLNHETe6rgKyqKhVQY5GBIZCwL8FuQZDZD";
      this._fbPages = new FbPages();
    }

    /**
     * loads events
     * @return {Promise} promise that resolves with an array of events that we
     * received from Facebook, formatted as instances of Event class
     */
    loadEvents(){
      return new Promise((resolve, reject) => {
        this._fbPages.loadIds()
        .then(ids => {
          return this.getEvents(ids);
        })
        .then(data => {
          return this.format(data);
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
     * @param {string[]} ids array of strings, ids of facebook pages related to larp
     * @return {Promise} promise that resolve with an array of data responses from Facebook
     */
    getEvents(ids){
      return new Promise((resolve, reject) => {
        var idArray = ids;
        var iterations = Math.ceil(idArray.length / 25);
        var result = Promise.resolve();
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

    /**
     * @param {Object[]} data  - array of objects received and put together from FB
     * @return {Event[]} events - array of Events
     */
    format(data){
      var events = this.organize(data);
      events = this.filter(events);
      events = this.classify(events);
      return events;
    }

    /**
     * Puts all events in one flat array, discards empty objects, makes things organized
     * @param {Object[]} data  - array of objects received and put together from FB
     * @return {Object[]} events - array of objects
     */
    organize(data){
      var events = [];
      for (var elem of data){
        for (var id in elem){
          if (elem.hasOwnProperty(id) && elem[id].data){
            events = events.concat(elem[id].data);
          }
        }
      }
      return events;
    }

    /**
     * Filteres events, only those happening in the future and with specified coordinates remain
     * @param {Object[]} events - array of objects, organized
     * @param {Object[]} filteredEvents - array of objects, filtered
     */
    filter(events){
      var filteredEvents = events.filter( event => {
        if (!event.place || !event.place.location || !event.place.location.latitude || !event.place.location.longitude){
          return false;
        }
        var now = new Date();
        var startTime = new Date(event.start_time);
        return now < startTime;
      });
      return filteredEvents;
    }

    /**
     * Makes the received events into instances of the Event class
     * @param {Object[]} events - array of objects, filtered
     * @param {Event[]} classifiedEvents - array of events
     */
    classify(events){
      var classifiedEvents = events.map( event => {
        var name = event.name;
        var description = event.description;
        var date = {
          start_date: event.start_time,
          end_date: event.end_time
        }
        var location = {
          latitude: event.place.location.latitude,
          longitude: event.place.location.longitude
        }
        var fbId = event.id;

        return new Event(name, description, date, location, fbId);
      });

      return classifiedEvents;
    }

}

module.exports = FbEvents;
