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
   * @param {id} - UID
   */
  trace(msg, id){
    let message = this.createMessage(msg, id);
    this._traceStream.write(message);
  }

  info(msg, id){
    let message = this.createMessage(msg, id);
    console.log(message);
    this._infoStream.write(message);
  }

  warn(msg, id){
    let message = this.createMessage(msg, id);
    this._warnStream.write(message);
  }

  error(msg, id){
    let message = this.createMessage(msg, id);
    this._errorStream.write(message);
  }

  createMessage(msg, id){
    let UID = id ? "UID: " + id + " " : "";
    return new Date().toISOString() + " : " + UID + msg + "\n";
  }


}

module.exports = Logger;
