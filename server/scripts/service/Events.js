/**
 * This is basically an interface to all classes handling events.
 */
class Events {
    /**
     * It loads all events from the relevant data store
     * @return {Promise|Event[]} Promise of array of Events available in given store.
     */
    load() {
    }

    /**
     * It takes event and saves it to the data store.
     * @param event {Event} It saves Event to the data store.
     * @return {Promise} Promise which returns nothing. It is only usable to realize when the saving is finished.
     */
    save(event) {
    }
}

module.exports = Events;