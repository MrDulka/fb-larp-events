const express = require('express');
const fs = require('fs');
const app = express();

const SqlEvents = require('../database/SqlEvents.js');
const UserFbEvents = require('../service/UserFbEvents.js');
const HrajLarpEvents = require('../service/HrajLarpEvents');
const HrajuLarpyEvents = require('../service/HrajuLarpyEvents');
const ScheduledEvents = require('../service/ScheduledEvents.js');

const EventsController = require('../controller/EventsController.js');

/**
 * class representing the web application
 */
class WebApplication {
    /**
     * create webapplication with properties linking to databases
     */
    constructor(pool, hrajLarpPool, logger) {
        this._pgPool = pool;
        this._hrajLarpPool = hrajLarpPool;

        this._logger = logger;
    }

    /**
     * setup the application
     * initiate mongoEvents and sqlEvents for interacting with the databases,
     * scheduledEvents for regularly getting the events from facebook
     * controller for managing user requests
     */
    setup() {
        const sqlEvents = new SqlEvents(this._pgPool, this._logger);
        this.schedule(sqlEvents);

        new EventsController(app, sqlEvents);

        app.listen(process.env.PORT || 5000);
        this.clientside();
    }

    /**
     * schedule updating of the specified database
     * @param db - instance of class for interacting with events in the database
     */
    schedule(db) {
        const userFbEvents = new UserFbEvents(this._pgPool, this._logger);
        const fbEvents = userFbEvents.initiateFbEvents();
        const hrajLarpEvents = new HrajLarpEvents(this._hrajLarpPool, this._logger);
        const hrajuLarpyEvents = new HrajuLarpyEvents(this._logger);
        const scheduledEvents = new ScheduledEvents([fbEvents, hrajLarpEvents, hrajuLarpyEvents], db, this._logger);

        scheduledEvents.schedule();
    }

    /**
     * run the client side of the app
     */
    clientside() {
    }

}

module.exports = WebApplication;
