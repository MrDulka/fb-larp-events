const DbFbKeywords = require('../database/DbFbKeywords');
const FbEvents = require('./FbEvents');

class UserFbEvents {
    constructor(pgPool, logger){
        this._logger = logger;
        this._pgPool = pgPool;
    }

    /**
     * initiate FbEvents with keywords from the database
     * @return instance of FbEvents
     */
    initiateFbEvents(){
        let dbFbKeywords = new DbFbKeywords(this._pgPool, this._logger);
        let promisedQueries = dbFbKeywords.load();
        return new FbEvents (promisedQueries, this._logger);
    }
}

module.exports = UserFbEvents;
