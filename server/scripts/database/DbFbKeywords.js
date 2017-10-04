
/**
 *  Class representing keywords for FB search
 */

class DbFbKeywords {
    /**
     * Creates DbFbKeywords
     * @param {Object} pgPool - represents sql connection pool
     * @param logger - logger for logging
     */
    constructor(pgPool, logger) {
        this._pgPool = pgPool;
        this._logger = logger;
    }

    /**
     *  Loads the keywords for searching on FB from the database
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
        });
    }
}

module.exports = DbFbKeywords;
