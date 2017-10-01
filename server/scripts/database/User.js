/**
 * Class representing a user
 */

class User {
    /**
     * @param {String} name - user's name
     * @param {String} nickname - user's nickname
     * @param {String} email - user's email
     */
    constructor(name, nickname, email){
        this._name = name;
        this._nickname = nickname;
        this._email = email;
    }

    get name() {
        return this._name;
    }
    get nickname() {
        return this._nickame;
    }
    get email() {
        return this._email;
    }

    set name(val) {
        this._name = val;
    }
    set nickname(val) {
        this._nickame = val;
    }
    set email(val) {
        this._email = val;
    }
}

module.exports = User;
