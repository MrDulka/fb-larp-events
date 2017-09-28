/**
 *  Class representing a game
 */

class Game {
    /** Create a game
     * @param {String} name
     * @param {String} description
     * @param {Number} year
     * @param {String} web
     * @param {Number} hours - length of the game in hours
     * @param {Number} days - length of the game in days
     * @param {Number} players - total amount of players
     * @param {Number} menRole - amount of roles for men only
     * @param {Number} womenRole - amount of roles for women only
     * @param {Number} bothRole - amount of roles playable by either men or womenRole
     * @param {Number} amountOfComments
     * @param {Number} amountOfPlayed
     * @param {Number} amountOfRatings
     * @param {Number} averageRating
     * @param {Number} id - game id in the database
     * @param {Number[]} community - array of UserIds of players that played or wish
     * to play this game in the future
     */
    constructor(name, description, year, web, hours, days, players, menRole, womenRole, bothRole,
        amountOfComments, amountOfPlayed, amountOfRatings, averageRating, id, community = []) {
        this._name = name;
        this._description = description;
        this._year = year;
        this._web = web;
        this._hours = hours;
        this._days = days;
        this._players = players;
        this._menRole = menRole;
        this._womenRole = womenRole;
        this._bothRole = bothRole;
        this._amountOfComments = amountOfComments;
        this._amountOfPlayed = amountOfPlayed;
        this._amountOfRatings = amountOfRatings;
        this._averageRating = averageRating;
        this._community = community;
        this._id = id;
    }

    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get year() {
        return this._year;
    }
    get web() {
        return this._web;
    }
    get hours() {
        return this._hours;
    }
    get days() {
        return this._days;
    }
    get players() {
        return this._players;
    }
    get menRole() {
        return this._menRole;
    }
    get womenRole() {
        return this._womenRole;
    }
    get bothRole() {
        return this._bothRole;
    }
    get amountOfComments() {
        return this._amountOfComments;
    }
    get amountOfPlayed() {
        return this._amountOfPlayed;
    }
    get amountOfRatings() {
        return this._amountOfRatings;
    }
    get averageRating() {
        return this._averageRating;
    }
    get id() {
        return this._id;
    }
    get community() {
        return this._community;
    }

    set name(val) {
         this._name = val;
    }
    set description(val) {
         this._description = val;
    }
    set year(val) {
         this._year = val;
    }
    set web(val) {
         this._web = val;
    }
    set hours(val) {
         this._hours = val;
    }
    set days(val) {
         this._days = val;
    }
    set players(val) {
         this._players = val;
    }
    set menRole(val) {
         this._menRole = val;
    }
    set womenRole(val) {
         this._womenRole = val;
    }
    set bothRole(val) {
         this._bothRole = val;
    }
    set amountOfComments(val) {
         this._amountOfComments = val;
    }
    set amountOfPlayed(val) {
         this._amountOfPlayed = val;
    }
    set amountOfRatings(val) {
         this._amountOfRatings = val;
    }
    set averageRating(val) {
         this._averageRating = val;
    }
    set id(val) {
        this._id = val;
    }
    set community(val) {
        this._community = val;
    }
}

module.exports = Game;
