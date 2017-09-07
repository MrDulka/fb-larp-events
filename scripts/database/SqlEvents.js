/**
  * This class represents Events in the postgreSQL database.
  */

class SqlEvents {

    /**
     * Create SqlEvents
     * @param {Object} pgPool - represents sql connection pool
     */
    constructor(pgPool) {
      this._pgPool = pgPool;
    }

    /**
     * Save the event into the database, if it is not already there - identified by fbId
     * @param {Event} event - Event to be stored in the database
     */
    save(event){
      let name = event.name;
      let description = event.description;
      let loc = event.location.name;
      let source = 'Facebook';
      let from = event.date.start_date.substr(0, 10);
      let to = event.date.end_date.substr(0, 10);
      let latitude = event.location.latitude;
      let longitude = event.location.longitude;
      let web = 'https://www.facebook.com/' + event.fbId;
      let added_by = 1;

      /** changed public.csld_events to event for testing
       * TODO: change back
       */
      let selectSql = `SELECT * FROM event WHERE web = '${web}'`;

      let insertSql = `INSERT INTO event ` +
                      `(name, description, loc, source, "from", "to", ` +
                      `latitude, longitude, web, added_by) ` +
                      `VALUES ` +
                      `('${name}', '${description}', '${loc}', '${source}',` +
                      `to_date( '${from}', 'YYYY-MM-DD'), ` +
                      `to_date( '${to}', 'YYYY-MM-DD'), ` +
                      `${latitude}, ${longitude}, '${web}', ${added_by})`;

      this._pgPool.query(selectSql).then(result => {
          if(result.rows.length > 0) {
              return null;
          } else {
              return this._pgPool.query(insertSql);
          }
      });
    }


    /**
     * Load all events from the database
     * @return {Promise} - promise that resolves with array of events in the database
     */
    load(){
      let selectSql = `SELECT * FROM event`;
      return this._pgPool.query(selectSql);
    }
}

module.exports = SqlEvents;
