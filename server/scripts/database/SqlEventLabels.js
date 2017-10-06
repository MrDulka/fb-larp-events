/**
 * This class corresponds to the event_has_labels table in the database
 */

class SqlEventLabels {
    /**
     * Creates SqlEventLabels
     * @param {Object} pgPool - represents sql connection pool
     * @param logger - logger for logging
     */
    constructor(pgPool, logger){
        this._pgPool = pgPool;
        this._logger = logger;
    }

    /**
     * Labels the event based on the source where it came from by inserting into event_has_labels table
     * Events from HrajuLarpy and HrajLarp are also automatically labeled as "komorní"
     * @param {Event} event - event to be labeled
     * @param {number} eventId - id of the event that was just inserted into the database
     * @return {Promise|Object} - promise that resolves with an object, result of the insertSql query
     */
    labelEvent(event, eventId){
        const komorniLabelId = 1;
        let findLabelIdSql = `SELECT * FROM public.csld_label WHERE name = '${event.source}'`;
        return this._pgPool.query(findLabelIdSql)
        .then(result => {
            if(result.rows.length === 1) {
                let labelId = result.rows[0].id;
                let insertSql = `INSERT INTO public.event_has_labels (event_id, label_id) VALUES (${eventId}, ${labelId});`;

                if (event.source === 'HrajuLarpy' || event.source === 'HrajLarp') {
                    insertSql += `INSERT INTO public.event_has_labels (event_id, label_id) VALUES (${eventId}, ${komorniLabelId});`
                }

                return this._pgPool.query(insertSql);
            }
        })
    }
}

module.exports = SqlEventLabels;
