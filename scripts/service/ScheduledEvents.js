class ScheduledEvents {
    static HOUR = 60 * 60 * 1000;

    constructor(inputEvents, serializeEvents) {
        this._timer = null;
        this._inputEvents = inputEvents;
        this._serializeEvents = serializeEvents;
    }

    load() {
        this._inputEvents.load().then(events => {
            this._serializeEvents.store(events);
        })
    }

    schedule() {
        this._timer = setInterval(this.load.bind(this), ScheduledEvents.HOUR);
        this.load();
    }
}

module.exports = ScheduledEvents;