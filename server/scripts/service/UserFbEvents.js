const DbFbKeywords = require('../database/DbFbKeywords');
const FbEvents = require('./FbEvents');

/**
 * This class coordinates searching on facebook with keywords in the database
 */
class UserFbEvents {
    /**
     * Create UserFbEvents
     * @param {Object} pgPool - represents sql connection pool
     * @param logger - logger for logging
     */
    constructor(pgPool, logger){
        this._logger = logger;
        this._pgPool = pgPool;
    }

    /**
     * Initiate FbEvents with keywords from the database
     * @return {FbEvents} instance of FbEvents
     */
    initiateFbEvents(){
        let dbFbKeywords = new DbFbKeywords(this._pgPool, this._logger);
        return new FbEvents (dbFbKeywords.load(), this._logger);
    }
}

module.exports = UserFbEvents;
