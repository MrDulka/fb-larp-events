/**
 * This class corresponds to the event_has_labels table in the database
 */

class SqlEventLabels {
    constructor(pgPool, logger){
        this._pgPool = pgPool;
        this._logger = logger;
    }

    /**
     * Labels the event 
     * @param {Event} event - event to be labeled
     * @param {number} eventId - id of the event that was just inserted into the database
     */
    labelEvent(event, eventId){
        const komorniLabelId = 1;
        let findLabelIdSql = `SELECT * FROM public.csld_label WHERE name = '${event.source}'`;

        return this._pgPool.query(findLabelIdSql)
        .then(result => {
            if(result.rows[0].length === 1) {
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
