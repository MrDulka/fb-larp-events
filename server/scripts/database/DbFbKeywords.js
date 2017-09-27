
/**
 *  class representing keywords for FB search
 */

class DbFbKeywords {
    constructor(pgPool, logger) {
        this._pgPool = pgPool;
        this._logger = logger;
    }

    /**
     *  load the keywords from the database
     *  @return {Promise|Object[]} promise that resolves with an array of objects
     *  containing the queries and associated types
     */
    load(){
        return this._pgPool.query(`SELECT * FROM public.fb_search_queries`).then(result => {
            return result.rows.map(item => {
                return {
                  query: item.query,
                  type: item.type
                }
            });
        }).catch(err => {
            this._logger.error(`DbFbKeywords#load Error: `, err);
        });
    }
}

module.exports = DbFbKeywords;
