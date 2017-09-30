let nodemailer = require('nodemailer');

/**
 * It sends an email based on the wanted information to the author of the game.
 */
class WantedEmail {
    /**
     * Creates new instance of WantedEmail capable of sending the wanted emails to the players.
     * @param mail {Object}
     * @param mail.host {String} Hostname of the server used for sending the emails.
     * @param mail.port {String} Port of the server
     * @param mail.user {String} User to be used for sending the emails
     * @param mail.pass {String} Password to be used to log into the email provider.
     */
    constructor(mail) {
        this._transporter = nodemailer.createTransport({
            host: mail.host,
            port: mail.port,
            secure: true, // secure:true for port 465, secure:false for port 587
            auth: {
                user: mail.user,
                pass: mail.pass
            }
        });
    }

    /**
     * It sends email about new wanted game to the user. To work it needs to provide the email
     * @param email {String} Email of the user who is receiving the notification
     * @param name {String} Name of the game, which event was added.
     * @param gameId {Integer} Id of the game used for creation of the URL.
     * @returns {Promise}
     */
    send(email, name, gameId) {
        let content = `Byla přidána událost, která se váže ke hře ${name}, kterou máte nastavenou jako chci hrát. Odkaz: https://larpovadatabaze.cz/event//${gameId}`;
        let subject = `Do kalendáře byla přidána událost ke hře, která vás zajímá.`;

        let mailOptions = {
            from: 'larpovadatabaze@gmail.com',
            to: email,
            subject: subject,
            html: `
                    <p>Ahoj,</p>
                    <p>
                       ${content}
                    </p> 
                    <p>Tým larpové databáze</p>
                `
        };

        return new Promise((resolve, reject) => {
            this._transporter.sendMail(mailOptions, (error, info) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });
    }
}

module.exports = WantedEmail;