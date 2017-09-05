/**
 * Class representing an Event
 */
class Event{
  /** Create an event
   * @param {string} name - name of the Event
   * @param {string} description - description of the Event
   * @param {Object} date - contains start and end dates of the Event
   * @param {Date} date.start_date - starting date and time of the Event
   * @param {Date} date.end_date - ending date and time of the Event
   * @param {Object} location - location of the Event
   * @param {string} location.name - name of the location
   * @param {number} location.latitude - latitude of the Event
   * @param {number} location.longitude - longitude of the Event
   * @param {number} fbId - id of the Event on Facebook
   */

  constructor(name, description, date, location, fbId){
    this._name = name;
    this._description = description;
    this._date = date;
    this._location = location;
    this._fbId = fbId;
  }

  get name(){
    return this._name;
  }
  get description(){
    return this._description;
  }
  get date(){
    return this._date;
  }
  get location(){
    return this._location;
  }
  get fbId(){
    return this._fbId;
  }

  set name(val){
    this._name = val;
  }
  set description(val){
    this._description = val;
  }
  set date(val){
    this._date = val;
  }
  set location(val){
    this._location = val;
  }
  set fbId(val){
    this._fbId = val;
  }

  json(){
    return {
      name: this.name,
      description: this.description,
      date: this.date,
      location: this.location,
      fbId: this.fbId
    }
  }
}

module.exports = Event;
