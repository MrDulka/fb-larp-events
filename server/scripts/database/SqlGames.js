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
    constructor(pgPool, logger){
        this._pgPool = pgPool;
        this._logger = logger;
    }

    /**
     * load games from the database
     * @return {Promise|Game[]} promise that resolves with an array of Games
     */
    load(){
        return this._pgPool.query(`SELECT * FROM public.csld_game`)
        .then(result => {
            return this.convert(result);
        })
        .catch(err =>{
          this._logger.error(`SqlGames#load Error: `, err);
        });
    }

    /**
     * converts games to instances of the Game class
     * @param {Object[]} games - array of games as received from the database
     * @return {Game[]} - array of instances of the Game class
     */
    convert(games){
        return games.rows.map(game => {
            return new Game(game.name, game.description, game.year, game.web, game.hours,
            game.days, game.players, game.men_role, game.women_role, game.both_role,
            game.amount_of_comments, game.amount_of_played, game.amount_of_ratings, game.average_rating);
        });
    }


}

module.exports = SqlGames;
