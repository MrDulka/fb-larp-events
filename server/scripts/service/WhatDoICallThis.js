const SqlGames = require('../database/SqlGames');
const SimilarGames = require('./SimilarGames');

/**
 * not sure how to name this class
 * Class provides communication between SqlGames and SimilarGames
 */
class MasterGames{
    constructor(pgPool, logger){
        this._pgPool = pgPool;
        this._logger = logger;
    }

    /**
     *  Just a concept
     */
    load(){
        let sqlGames = new SqlGames(this._pgPool, this._logger);

        return sqlGames.load().then(games => {
            let similarGames = new SimilarGames(games, this._logger);
            return similarGames.compareAllToAll();
        })
        .catch(err => {
            this._logger(err); //TODO: finish after naming
        });

    }
}

module.exports = MasterGames;
