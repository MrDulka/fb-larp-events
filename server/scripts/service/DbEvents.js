const Events = require('./Events');
const SqlEvents = require('../database/SqlEvents');
const SqlEventLabel = require('../database/SqlEventLabel');
const SqlGameEvent = require('../database/SqlGameEvent');
const SqlGameUser = require('../database/SqlGameUser');
const SqlUsers = require('../database/SqlUsers');
const WantedEmail = require('./mail/WantedEmail');

/**
 * Class stores events in the database
 * @augments Events
 */

class DbEvents extends Events{
    constructor(pgPool, logger){
        super();

        this._pgPool = pgPool;
        this._logger = logger;

        this._sqlEventLabel = new SqlEventLabel(pgPool, logger);
        this._sqlGameEvent = new SqlGameEvent(pgPool, logger);
        this._sqlGameUser = new SqlGameUser(pgPool, logger);
        this._sqlUsers = new SqlUsers(pgPool, logger);

        this._sqlEvents = new SqlEvents(pgPool, logger, this._sqlEventLabel, this._sqlGameEvent);
    }

    /**
     * @inheritDoc
     * also if the
     */
    save(event){
        return this._sqlEvents.save(event)
        .then(savedEvent => {
            if (!savedEvent){
                return;
            }
            //find the game corresponding to the saved event
            return this._sqlGameEvent.findGame(savedEvent);
        })
        .then(gameId => {
            if (!gameId){
                return;
            }
            //find the users that want to play the game
            return this._sqlGameUser.getWantToPlay(gameId);
        })
        .then(wantToPlay => {
            if (!wantToPlay){
                return;
            }
            //find users by their ids
            return this._sqlUsers.byIds(wantToPlay);
        })
        .then(users => {
            //Send emails
            console.log(users);
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
