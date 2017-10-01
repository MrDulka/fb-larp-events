/**
 *  This class corresponds to the csld_user_played_game in the database
 */

class SqlGameUser{

    /**
    * Create SqlGameUser
    * @param {Object} pgPool - represents sql connection pool
    * @param logger - logger for logging
    */
    constructor(pgPool, logger){
       this._pgPool = pgPool;
       this._logger = logger;
    }

    /**
    * finds players that played or would like to play the game and adds them to game's "community"
    * @param {Games[]} games - array of games
    * @return {Promise|Games[]} - promise resolves with array of games with added values in their
    * community property
    */
    getCommunity(games){
       this._logger.info("SqlGameUser#getCommunity");

       return this._pgPool.query(`SELECT * FROM public.csld_user_played_game`)
       .then(result => {
           result.rows
               .filter(row => row.state === 1 || row.state === 2)
               .forEach(row => {
                   games
                       .filter(game => game.id === row.game_id)
                       .forEach(game => game.community.push(row.user_id));
           });
           return games;
       });
    }

    /**
    * finds users that want to play the game specified by gameId
    * @param {Number} gameId - id of the game that we want to testindex
    * @return {Promise|Number[]} promise that resolves with array of userIds of users
    * who want to play the game
    */
    getWantToPlay(gameId){
        return this._pgPool.query(`SELECT * FROM public.csld_user_played_game`)
        .then(result => {
            return result.rows
                .filter(row => row.state === 1 && row.game_id === gameId)
                .map(row => row.user_id);        
        });
    }
}

module.exports = SqlGameUser;
