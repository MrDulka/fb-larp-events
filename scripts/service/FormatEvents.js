var Event = require('../database/Event.js');

/**
 * class for formatting events
 */

class FormatEvents{
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
   * @param {Object[]} - array of objects, filtered
   */
  filter(events){
    return events.filter( event => {
      if (!event.place || !event.place.location || !event.place.location.latitude || !event.place.location.longitude){
        return false;
      }
      var now = new Date();
      var startTime = new Date(event.start_time);
      return now < startTime;
    });
  }

  /**
   * Makes the received events into instances of the Event class
   * @param {Object[]} events - array of objects, filtered
   * @param {Event[]}  - array of events
   */
  classify(events){
    return events.map( event => {
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
  }

}

module.exports = FormatEvents;
