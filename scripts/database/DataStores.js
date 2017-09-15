const {Pool} = require('pg');

/**
 * class representing the databases we use
 */

class DataStores {
    /**
     * initiate datastores with the provided links to databases
     */
    constructor(urls) {
        this._urls = urls
    }

    /**
     * setup the databases, create connections to them
     * @return {Promise} promise that resolves with an array of databases
     */
    setup() {
        return Promise.resolve(
            this._urls.map(
                url => new Pool({connectionString: url})
            )
        );
    }
}

module.exports = DataStores;
