/**
 *  This class corresponds to table similar_games in the database
 */

class SqlSimilarGames{

    /**
    * Create SqlSimilarGames
    * @param {Object} pgPool - represents sql connection pool
    * @param logger - logger for logging
    */
    constructor(pgPool, logger){
       this._pgPool = pgPool;
       this._logger = logger;
    }

    /**
     * clear the table and then save all the games anew
     * @param {Game[]} games Array of games to be saved
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
