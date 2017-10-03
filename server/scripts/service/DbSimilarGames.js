const SqlGames = require('../database/SqlGames');
const SimilarGames = require('./SimilarGames');
const SqlGameUser = require('../database/SqlGameUser');
const SqlGameLabel = require('../database/SqlGameLabel');
const SqlGameAuthor = require('../database/SqlGameAuthor');
const SqlSimilarGames = require('../database/SqlSimilarGames');

/**
 * Class representing similar games in the database
 * provides communication between SqlGames and SimilarGames
 */
class DbSimilarGames{
    constructor(pgPool, logger){
        this._pgPool = pgPool;
        this._logger = logger;

        const sqlGameUser = new SqlGameUser(pgPool, logger);
        const sqlGameLabel = new SqlGameLabel(pgPool, logger);
        const sqlGameAuthor = new SqlGameAuthor(pgPool, logger);
        this._sqlGames = new SqlGames(pgPool, logger, sqlGameUser, sqlGameLabel, sqlGameAuthor);
        this._sqlSimilarGames = new SqlSimilarGames(pgPool, logger);
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

    /**
     * save games into the database
     * @param {Game[]} games - array of games to be saved
     */
    save(games){
        this._logger.info(`DbSimilarGames#save`);
        return this._sqlSimilarGames.save(games);
    }
}

module.exports = DbSimilarGames;
