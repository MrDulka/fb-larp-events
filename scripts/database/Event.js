/**
 * Class representing an Event
 */
class Event{
  /** Create an event
   * @param {string} name - name of the Event
   * @param {Object} date - contains start and end dates of the Event
   * @param {Date} date.start_date - starting date and time of the Event
   * @param {Date} date.end_date - ending date and time of the Event
   * @param {Object} location - location of the Event
   * @param {number} location.latitude - latitude of the Event
   * @param {number} location.longitude - longitude of the Event
   * @param {number} fbId - id of the Event on Facebook
   */
   
  constructor(name, date, location, fbId){
    this._name = name;
    this._date = date;
    this._location = location;
    this._fbId = fbId;
  }
}

module.exports = Event;
