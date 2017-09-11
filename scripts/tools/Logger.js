const fs = require('fs');

/*
 * class used for logging
 */

class Logger {
  /*
   * Create write streams to logging files
   */
  constructor(){
    this._traceStream = fs.createWriteStream('logs/trace.txt', {flags:"a+"});
    this._infoStream = fs.createWriteStream('logs/info.txt', {flags:"a+"});
    this._warnStream = fs.createWriteStream('logs/warn.txt', {flags:"a+"});
    this._errorStream = fs.createWriteStream('logs/error.txt', {flags:"a+"});
  }

  /*
   * All methods log the passed in messages into related files
   * @param {string} msg - message to log
   */
  trace(msg){
    let message = new Date().toISOString() + " : " + msg + "\n";
    this._traceStream.write(message);
  }

  info(msg){
    let message = new Date().toISOString() + " : " + msg + "\n";
    this._infoStream.write(message);
  }

  warn(msg){
    let message = new Date().toISOString() + " : " + msg + "\n";
    this._warnStream.write(message);
  }

  error(msg){
    let message = new Date().toISOString() + " : " + msg + "\n";
    this._errorStream.write(message);
  }

}

module.exports = Logger;
