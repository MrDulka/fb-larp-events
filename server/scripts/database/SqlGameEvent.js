/**
 * This class corresponds to the event_has_labels table in the database
 */

class SqlGameEvent {

    constructor(pgPool, logger){
        this._pgPool = pgPool;
        this._logger = logger;
    }

    /**
     * Matches events with games in the database
     * @param {Event} event - event to be matched
     * @param {number} eventId - id of the event that was just inserted into the database
     */
    matchGameEvent(event, eventId){
        let findGameSql = `SELECT * FROM public.csld_game WHERE name = '${event.name}'`;

        return this._pgPool.query(findGameSql)
        .then(result => {
            //match if there is only one game with the same name as the event
            if (result.rows.length === 1) {
                let gameId = result.rows[0].id;
                let insertSql = `INSERT INTO public.csld_game_has_event (game_id, event_id) VALUES (${gameId}, ${eventId})`;
                return this._pgPool.query(insertSql);
            }
        })
    }
}

module.exports = SqlGameEvent;
