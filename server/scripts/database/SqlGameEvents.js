const stringSimilarity = require('string-similarity');
const _ = require('underscore');
/**
 * This class corresponds to the csld_game_has_event table in the database
 */

class SqlGameEvents {

  /**
   * Creates SqlGameEvents
   * @param {Object} pgPool - represents sql connection pool
   * @param logger - logger for logging
   */
    constructor(pgPool, logger){
        this._pgPool = pgPool;
        this._logger = logger;
    }

    /**
     * Matches events with games in the database
     * @param {Event} event - event to be matched
     * @param {Number} eventId - id of the event that was just inserted into the database
     * @return {Promise|undefined} - promise that resolves with undefined
     */
    matchGameEvent(event, eventId){
        return this.findGames(event)
        .then(gameIds => {
            return gameIds.forEach(gameId => {
                this._pgPool.query(`INSERT INTO public.csld_game_has_event (game_id, event_id) VALUES (${gameId}, ${eventId})`);
            });
        });
    }

    /**
     * Finds games matching with the provided event based on their name
     * @param {Event} event - event that we want matched
     * @return {Promise|Number[]} promise that resolves with array of ids of games that match with the event
     */
    findGames(event){
        let findGameSql = `SELECT * FROM public.csld_game WHERE deleted <> true`;

        return this._pgPool.query(findGameSql)
        .then(result => {
            return result.rows.reduce((accumulator, game) => {
                if (this.similar(game.name, event.name)) {
                    return accumulator.concat(game.id);
                }
                return accumulator;
            }, []);
        });
    }

    /**
     * Compares name of the game and name of the event and decides if they are similar enough
     * @param {String} gameName - name of the game
     * @param {String} eventName - name of the event
     * @return {Boolean} true if they are similar, false otherwise
     */
    similar(gameName, eventName){
        let additionalWords = ['', 'larp', 'běh'];
        let coefficients = additionalWords.map(word => stringSimilarity.compareTwoStrings(gameName + ' ' + word, eventName));

        for (let c of coefficients){
            if (c > 0.8) {
                return true;
            }
        }
        return false;
    }

}

module.exports = SqlGameEvents;
