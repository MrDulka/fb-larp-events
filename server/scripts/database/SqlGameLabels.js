/**
 *  This class corresponds to the csld_game_has_label in the database
 */

 class SqlGameLabels{

   /**
    * Create SqlGameLabels
    * @param {Object} pgPool - represents sql connection pool
    * @param logger - logger for logging
    */
   constructor(pgPool, logger){
       this._pgPool = pgPool;
       this._logger = logger;
   }

   /**
    * finds labels assosiated with the game and adds them to game's labels
    * @param {Game[]} games Array of games to search labels for
    * @return {Promise|Game[]} - promise resolves with array of games with added values in their
    *   labels property
    */
   getLabels(games){
       this._logger.info("SqlGameLabels#getLabels");

       return this._pgPool.query(`SELECT * FROM public.csld_game_has_label`)
       .then(result => {
           result.rows.forEach(row => {
               games
                   .filter(game => game.id === row.id_game)
                   .forEach(game => game.labels.push(row.id_label));
           });
           return games;
       });
   }

}

module.exports = SqlGameLabels;
