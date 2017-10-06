const Events = require('./Events');
const SqlEvents = require('../database/SqlEvents');
const SqlEventLabels = require('../database/SqlEventLabels');
const SqlGameEvents = require('../database/SqlGameEvents');
const SqlGameUsers = require('../database/SqlGameUsers');
const SqlUsers = require('../database/SqlUsers');
const SqlGames = require('../database/SqlGames');
const WantedEmail = require('./mail/WantedEmail');
const config = require('../../../config');

/**
 * Class represents events in the datastore
 * @augments Events
 */

class DbEvents extends Events{
    /**
    * Creates DbEvents
    * @param {Object} pgPool - represents sql connection pool
    * @param logger - logger for logging
    */
    constructor(pgPool, logger){
        super();

        this._pgPool = pgPool;
        this._logger = logger;

        this._sqlEventLabels = new SqlEventLabels(pgPool, logger);
        this._sqlGameEvents = new SqlGameEvents(pgPool, logger);
        this._sqlGameUsers = new SqlGameUsers(pgPool, logger);
        this._sqlUsers = new SqlUsers(pgPool, logger);
        this._sqlGames = new SqlGames(pgPool, logger);
        this._sqlEvents = new SqlEvents(pgPool, logger);

        this._wantedEmail = new WantedEmail(config.email);
    }

    /**
     * Saves an event
     * if the event is really saved and not already in the database, finds if there is a matching
     * game to the event, if there are people that want to play the game and sends an email
     * notification to those players
     * @param {Event} event to be savedEvent
     * @return {}
     */
    save(event){
        let gameName, eventId;

        return this._sqlEvents.save(event)
        .then(savedEventId => {
            if (!savedEventId){
                return;
            }
            eventId = savedEventId;
            this._sqlGameEvents.matchGameEvent(event, eventId);
            this._sqlEventLabels.labelEvent(event, eventId);
            return this._sqlGameEvents.findGame(event);
        })
        .then(gameId => {
            if (!gameId){
                return;
            }
            //get the game by its id
            return this._sqlGames.byId(gameId);
        })
        .then(game => {
            if (!game){
                return;
            }
            gameName = game.name;
            //find the users that want to play the game
            return this._sqlGameUsers.getWantToPlay(game.id);
        })
        .then(wantToPlay => {
            if (!wantToPlay){
                return;
            }
            //find users by their ids
            return this._sqlUsers.byIds(wantToPlay);
        })
        .then(users => {
            if (!users){
                return;
            }
            //send emails
            let result = Promise.resolve();
            for (let user of users) {
                result = result.then(() =>{
                    return this._wantedEmail.send(user.email, gameName, event.name, eventId)
                })
                .then(info => {
                    this._logger.info(user, info);
                });
            }
            return result;
        })
        .catch(err => {
            this._logger.error(`DbEvents#save Error:`, err);
        });
    }

    /**
     * @inheritDoc
     */
    load(){
        return this._sqlEvents.load();
    }
}

module.exports = DbEvents;
