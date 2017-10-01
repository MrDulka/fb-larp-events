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
 }

module.exports = SqlGameUser;
