const {Pool} = require('pg');

/**
 * Class representing the databases we use
 */

class DataStores {
    /**
     * Initiates datastores with the provided links to databases
     * @param {String[]} urls - array of strings with urls
     */
    constructor(urls) {
        this._urls = urls
    }

    /**
     * Sets the databases up, creates connections to them
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
