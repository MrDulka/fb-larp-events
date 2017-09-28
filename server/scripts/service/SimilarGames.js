const _ = require('underscore');

class SimilarGames {

    /**
     * create SimilarGames
     * @param {Games[]} games - array of games
     * @param {Logger} logger
     */
    constructor(games, logger) {
        this._games = games;
        this._logger = logger;
    }

    /**
     * Evaluates how similar two games are
     * @param {Game} game1
     * @param {Game} game2 - games to compare
     * @return {Number} rating describing the similarity of the games
     */
    compare(game1, game2){
        let rating = 0;

        if (game1.year && game2.year){
            let yearDiff = Math.abs(game1.year-game2.year);
            rating -= yearDiff;
        }
        if (game1.hours && game2.hours){
            let diff = Math.abs(game1.hours-game2.hours);
            if (diff < 2) rating++;
        }

        if (game1.days && game2.days){
            if (game1.days === game2.days) rating++;
        }

        if (game1.players && game2.players){
            let ratio = game1.players/game2.players;
            if (0.666 < ratio && ratio < 1.5) rating++;
        }

        if (game1.menRole && game2.menRole){
            let ratio = game1.menRole/game2.menRole;
            if (0.666 < ratio && ratio < 1.5) rating++;
        }

        if (game1.womenRole && game2.womenRole){
            let ratio = game1.womenRole/game2.womenRole;
            if (0.666 < ratio && ratio < 1.5) rating++;
        }

        if (game1.averageRating && game2.averageRating){
            let diff = Math.abs(game1.averageRating-game2.averageRating);
            if (diff < 10) rating++;
        }

        let sharedCommunity = _.intersection(game1.community, game2.community).length;
        rating += Math.log(sharedCommunity+1);

        let sharedLabels = _.intersection(game1.labels, game2.labels).length;
        rating += sharedLabels;

        return rating;
    }

    /**
     * Calculates similarity of the passed in game to all of the games stored
     * in this._games property
     * @param {Game} game1 - game to evaluate
     * @return {Object[]} array of object with two properties - name and similarityRating
     *
     */
    compareToAll(game1){
        return this._games.map(game2 => {
            let rating = this.compare(game1, game2);
            if (game1.name === game2.name){
                rating = -99;
            }
            return {
                name: game2.name,
                rating: rating
            };
        });
    }

    /**
     * Calculates similar games for all games in this._games property
     * @return {Game[]} - returns array of games with added array of 5 most similar games in their
     * "similar" property
     */
    compareAllToAll () {
        return this._games.map(game => {
            let ratings = this.compareToAll(game).sort((a, b) => {
                return b.rating - a.rating;
            });

            game.similar = ratings.slice(0, 5);
            return game;
        });
    }
}

module.exports = SimilarGames;
