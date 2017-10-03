const Game = require('./Game');

/**
 * Class representing games in the postgreSQL database
 */

class SqlGames {
    /**
     * Create SqlGames
     * @param {Object} pgPool - represents sql connection pool
     * @param logger
     */
    constructor(pgPool, logger, sqlGameUsers, sqlGameLabels, sqlGameAuthors){
        this._pgPool = pgPool;
        this._logger = logger;
        this._sqlGameUsers = sqlGameUsers;
        this._sqlGameLabels = sqlGameLabels;
        this._sqlGameAuthors = sqlGameAuthors;
    }

    /**
     * load games from the database
     * @return {Promise|Game[]} promise that resolves with an array of Games
     */
    load(){
        this._logger.info("SqlGames#load");

        return this._pgPool.query(`SELECT * FROM public.csld_game WHERE deleted <> true`)
        .then(result => {
            return this.convert(result);
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
     * converts games to instances of the Game class
     * @param {Object[]} games - array of games as received from the database
     * @return {Promise|Game[]} - promise that resolves with array of instances of the Game class
     */
    convert(games){
        return games.rows.map(game => {
            return new Game(game.name, game.description, game.year, game.web, game.hours,
            game.days, game.players, game.men_role, game.women_role, game.both_role,
            game.amount_of_comments, game.amount_of_played, game.amount_of_ratings,
            game.average_rating, game.id);
        });
    }

    /**
     * Find a game with the specified id in the database
     * @param {Number} gameId - id of the game to be found
     * @return {Promise|Game} - promise that resolves with a Game
     */
    byId(gameId){
        return this._pgPool.query(`SELECT * FROM public.csld_game WHERE id=${gameId} AND deleted <> true`)
        .then(result => {
            return this.convert(result)[0];
        });
    }

}

module.exports = SqlGames;
