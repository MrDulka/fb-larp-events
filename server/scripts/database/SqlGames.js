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
        this._logger.info("SqlGames#load");

        return this._pgPool.query(`SELECT * FROM public.csld_game`)
        .then(result => {
            return this.convert(result);
        })
        .then(games => {
            return this.getCommunity(games);
        })
        .then(games => {
            return this.getLabels(games);
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
            game.amount_of_comments, game.amount_of_played, game.amount_of_ratings,
            game.average_rating, game.id, [], []);
        });
    }

    /**
     * finds players that played or would like to play the game and adds them to game's "community"
     * @param {Games[]}
     * @return {Promise|Games[]} - promise resolves with array of games with added values in their
     * community property
     */
    getCommunity(games){
        this._logger.info("SqlGames#getCommunity");

        return this._pgPool.query(`SELECT * FROM public.csld_user_played_game`)
        .then(result => {
            result.rows.forEach(row => {
                if (row.state !== 1 && row.state !== 2) return;
                let index = games.findIndex(game => {
                    return game.id === row.game_id;
                });
                games[index].community.push(row.user_id);
            });
            return games;
        })
        .catch(err => {
            this._logger.error(`SqlGames#getCommunity Error: `, err);
        });
    }

    /**
     * finds labels assosiated with the game and adds them to game's labels
     * @param {Games[]}
     * @return {Promise|Games[]} - promise resolves with array of games with added values in their
     * labels property
     */
    getLabels(games){
        this._logger.info("SqlGames#getLabels");

        return this._pgPool.query(`SELECT * FROM public.csld_game_has_label`)
        .then(result => {
            result.rows.forEach(row => {
                let index = games.findIndex(game => {
                    return game.id === row.id_game;
                });
                games[index].labels.push(row.id_label);
            });
            return games;
        })
        .catch(err => {
            this._logger.error(`SqlGames#getLabels Error: `, err);
        });
    }

}

module.exports = SqlGames;