const User = require('./User');

/**
 * This class represents users in the postgreSQL database
 */
class SqlUsers{

    /**
    * Creates SqlUsers
    * @param {Object} pgPool - represents sql connection pool
    * @param logger - logger for logging
    */
    constructor(pgPool, logger){
        this._pgPool = pgPool;
        this._logger = logger;
    }

    /**
     * Gets Users by specified ids
     * @param {Number[]} ids - array of userIds of the users that we want to get
     * @return {Promise|User[]} - promise that resolves with an array of Users
     */
    byIds(ids){
        return this._pgPool.query(`SELECT * FROM public.csld_csld_user`)
        .then(result => {
            let users = [];
            result.rows.forEach(row=>{
                if (ids.indexOf(row.id) > -1){
                    users.push(row);
                }
            });
            return this.convert(users);
        });
    }

    /**
     * Converts users to instances of the User class
     * @param {Object[]} users - array of objects gotten from the database
     * @return {User[]} - array of Users
     */
    convert(users){
        return users.map(user => {
            return new User(user.name, user.nickname, user.email);
        });
    }
}

module.exports = SqlUsers;
