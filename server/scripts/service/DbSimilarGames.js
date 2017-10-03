const SqlGames = require('../database/SqlGames');
const SimilarGames = require('./SimilarGames');
const SqlGameUsers = require('../database/SqlGameUsers');
const SqlGameLabels = require('../database/SqlGameLabels');
const SqlGameAuthors = require('../database/SqlGameAuthors');
const SqlSimilarGames = require('../database/SqlSimilarGames');

/**
 * Class representing similar games in the database
 * provides communication between SqlGames and SimilarGames
 */
class DbSimilarGames{
    constructor(pgPool, logger){
        this._pgPool = pgPool;
        this._logger = logger;

        const sqlGameUsers = new SqlGameUsers(pgPool, logger);
        const sqlGameLabels = new SqlGameLabels(pgPool, logger);
        const sqlGameAuthors = new SqlGameAuthors(pgPool, logger);
        this._sqlGames = new SqlGames(pgPool, logger, sqlGameUsers, sqlGameLabels, sqlGameAuthors);
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
