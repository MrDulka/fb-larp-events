const SqlGames = require('../database/SqlGames');
const SimilarGames = require('./SimilarGames');

/**
 * not sure how to name this class
 * Class provides communication between SqlGames and SimilarGames
 */
class DbSimilarGames{
    constructor(pgPool, logger){
        this._pgPool = pgPool;
        this._logger = logger;
        this._sqlGames = new SqlGames(pgPool, logger);
    }

    /**
     *  load games, calculates similar games and stores them in the database
     */
    load(){
        this._logger.info(`DbSimilarGames#load`);

        this._sqlGames.load().then(games => {
            let similarGames = new SimilarGames(games, this._logger);
            return this.save(similarGames.compareAllToAll());
        })
        .catch(err => {
            this._logger.error(`DbSimilarGames#load Error:`, err);
        });

    }

    save(games){
        this._logger.info(`DbSimilarGames#save`);
        return this._sqlGames.save(games);
    }
}

module.exports = DbSimilarGames;
