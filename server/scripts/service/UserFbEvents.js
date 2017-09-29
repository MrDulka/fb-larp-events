const DbFbKeywords = require('../database/DbFbKeywords');
const FbEvents = require('./FbEvents');

class UserFbEvents {
    constructor(pgPool, logger){
        this._logger = logger;
        this._pgPool = pgPool;
    }

    /**
     * initiate FbEvents with keywords from the database
     * @return {FbEvents} instance of FbEvents
     */
    initiateFbEvents(){
        let dbFbKeywords = new DbFbKeywords(this._pgPool, this._logger);
        return new FbEvents (dbFbKeywords.load(), this._logger);
    }
}

module.exports = UserFbEvents;
