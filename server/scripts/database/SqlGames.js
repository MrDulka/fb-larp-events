const Game = require('./Game');

/**
 * Class representing games in the postgreSQL database
 */

class SqlGames {
    /**
     * Creates SqlGames
     * @param {Object} pgPool - represents sql connection pool
     * @param logger - logger for logging
     */
    constructor(pgPool, logger, sqlGameUsers, sqlGameLabels, sqlGameAuthors){
        this._pgPool = pgPool;
        this._logger = logger;
        this._sqlGameUsers = sqlGameUsers;
        this._sqlGameLabels = sqlGameLabels;
        this._sqlGameAuthors = sqlGameAuthors;
    }

    /**
     * Loads games from the database
     * @return {Promise|Game[]} promise that resolves with an array of Games
     */
    load(){
        this._logger.info("SqlGames#load");

        return this._pgPool.query(`SELECT * FROM public.csld_game WHERE deleted <> true`)
        .then(result => {
            return this.convert(result.rows);
        })
        .then(games => {
            return this._sqlGameUsers.getCommunity(games);
        })
        .then(games => {
            return this._sqlGameLabels.getLabels(games);
        })
        .then(games => {
            return this._sqlGameAuthors.getAuthors(games);
        });
    }

    /**
     * Converts games to instances of the Game class
     * @param {Object[]} games - array of games as received from the database
     * @return {Promise|Game[]} - promise that resolves with array of instances of the Game class
     */
    convert(games){
        return games.map(game => {
            return new Game(game.name, game.description, game.year, game.web, game.hours,
            game.days, game.players, game.men_role, game.women_role, game.both_role,
            game.amount_of_comments, game.amount_of_played, game.amount_of_ratings,
            game.average_rating, game.id);
        });
    }

    /**
     * Finds games with the specified ids in the database
     * @param {Number[]} gameIds - ids of the game to be found
     * @return {Promise|Game[]} - promise that resolves with an array of Games
     */
    byIds(gameIds){
        return this._pgPool.query(`SELECT * FROM public.csld_game WHERE deleted <> true`)
        .then(result => {
            let games = result.rows.reduce((accumulator, game) => {
                if (gameIds.indexOf(game.id) > -1){
                    return accumulator.concat(game);
                }
                return accumulator;
            }, []);
            return this.convert(games);
        });
    }

}

module.exports = SqlGames;
