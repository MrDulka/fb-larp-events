const fs = require('fs');

/**
 * Purpose of this class is to allow us to set different logging level and cleaning unnecessary information from console
 * when the application is deployed in production.
 */
class Logger {
    constructor() {
        this.LEVEL_TRACE = 0;
        this.LEVEL_INFO = 1;
        this.LEVEL_WARN = 2;
        this.LEVEL_ERROR = 3;
        this.LEVEL_NONE = 4;

        this.currentLevel = this.LEVEL_INFO;

        // TODO: Fix. This is asynchronous, but the calls depends on it being synchronous.
        this._streams = {
            trace: fs.createWriteStream('logs/trace.txt', {flags: "a+"}),
            info: fs.createWriteStream('logs/info.txt', {flags: "a+"}),
            warn: fs.createWriteStream('logs/warn.txt', {flags: "a+"}),
            error: fs.createWriteStream('logs/error.txt', {flags: "a+"})
        };
    }

    setLevel(level) {
        if(
            level == this.LEVEL_ERROR ||
            level == this.LEVEL_WARN ||
            level == this.LEVEL_INFO ||
            level == this.LEVEL_TRACE ||
            level == this.LEVEL_NONE)  {
            this.currentLevel = level;
        }
    }

    trace(message) {
        return this.log('log', this.LEVEL_TRACE, arguments);
    }

    info(message) {
        return this.log('info', this.LEVEL_INFO, arguments);
    }

    warn(message) {
        return this.log('warn', this.LEVEL_WARN, arguments);
    }

    error(message) {
        return this.log('error', this.LEVEL_ERROR, arguments);
    }

    log(method, level, passedArguments) {
        let args = Array.prototype.slice.call(passedArguments);
        args.unshift(method.toUpperCase() + " ");
        args.unshift(new Date().toISOString());
        args.unshift("[Panther] ");
        if(this.currentLevel <= level) {
            let message = console[method].apply(console, args);
            this._streams[method].write(message);
            return message;
        } else {
            return '';
        }
    }
}

module.exports = Logger;