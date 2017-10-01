const User = require('./User');

/**
 * This class represents users in the postgreSQL database
 */
class SqlUsers{
    constructor(pgPool, logger){
        this._pgPool = pgPool;
        this._logger = logger;
    }

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

    convert(users){
        return users.map(user => {
            return new User(user.name, user.nickname, user.email);
        });
    }
}

module.exports = SqlUsers;
