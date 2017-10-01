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
    compare(game1, game2) {
        let rating = 0;

        if (game1.year && game2.year) {
            let diff = Math.abs(game1.year - game2.year);
            if (diff <= 2){
                rating += 2;
            }
            else if (diff <= 5){
                rating++;
            }
        }

        if (game1.hours && game2.hours) {
            let diff = Math.abs(game1.hours - game2.hours);
            if (diff < 2) {
                rating++;
            }
        }

        if (game1.days && game2.days) {
            if (game1.days === game2.days) {
                rating++;
            }
        }

        if (game1.players && game2.players) {
            let ratio = game1.players / game2.players;
            if (0.666 < ratio && ratio < 1.5) {
                rating++;
            }
        }

        //compares number of roles for specific gender with all the roles
        let totalRoles1 = game1.menRole + game1.womenRole + game1.bothRole;
        let totalRoles2 = game2.menRole + game2.womenRole + game2.bothRole;
        if (totalRoles1 && totalRoles2){
            let menRatio1 = game1.menRole/totalRoles1;
            let menRatio2 = game2.menRole/totalRoles2;
            let menDiff = Math.abs(menRatio1 - menRatio2);
            if(menDiff < 0.1) {
                rating+=0.5;
            }

            let womenRatio1 = game1.womenRole/totalRoles1;
            let womenRatio2 = game2.womenRole/totalRoles2;
            let womenDiff = Math.abs(womenRatio1 - womenRatio2);
            if(womenDiff < 0.1) {
                rating+=0.5;
            }

            let bothRatio1 = game1.bothRole/totalRoles1;
            let bothRatio2 = game2.bothRole/totalRoles2;
            let bothDiff = Math.abs(bothRatio1 - bothRatio2);
            if(bothDiff < 0.1) {
                rating+=0.5;
            }
        }

        if (game1.averageRating && game2.averageRating) {
            let diff = Math.abs(game1.averageRating - game2.averageRating);
            if (diff < 8) {
                rating++;
            }
        }

        let shared = _.intersection(game1.community, game2.community).length;
        let total = _.union(game1.community, game2.community).length;
        if (total != 0) {
            let communityRatio = shared/total;
            rating += communityRatio*5;
        }

        let sharedLabels = _.intersection(game1.labels, game2.labels).length;
        rating += sharedLabels;

        let sharedAuthors = _.intersection(game1.authors, game2.authors).length;
        if (sharedAuthors > 0) {
            rating++;
        }

        return rating;
    }

    /**
     * Calculates similarity of the passed in game to all of the games stored
     * in this._games property
     * @param {Game} game1 - game to evaluate
     * @return {Object[]} array of object with two properties - name and similarityRating
     *
     */
    compareToAll(game1) {
        return this._games.map(game2 => {
            let rating = this.compare(game1, game2);
            if (game1.id === game2.id) {
                rating = -99;
            }
            return {
                id: game2.id,
                rating: rating
            };
        });
    }

    /**
     * Calculates similar games for all games in this._games property
     * @return {Game[]} - returns array of games with added array of 5 most similar games in their
     * "similar" property
     */
    compareAllToAll() {
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
