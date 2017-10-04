/**
 *  This class corresponds to table similar_games in the database
 */

class SqlSimilarGames{

    /**
    * Creates SqlSimilarGames
    * @param {Object} pgPool - represents sql connection pool
    * @param logger - logger for logging
    */
    constructor(pgPool, logger){
       this._pgPool = pgPool;
       this._logger = logger;
    }

    /**
     * Clears the table and then saves all the similar games anew
     * @param {Game[]} games - array of games to be saved
     * @return {Promise|undefined} - promise that resolves with undefined
     */
    save(games){
        return this._pgPool.query(`TRUNCATE TABLE public.similar_games`)
        .then(() => {
            return games.forEach(game => {
              return game.similar.forEach(similarGame => {
                  return this._pgPool.query(`INSERT INTO public.similar_games (id_game1, id_game2, similarity_coefficient)
                  VALUES (${game.id}, ${similarGame.id}, ${similarGame.rating})`);
              });
            });
        });
    }
}

module.exports = SqlSimilarGames;
