
class SqlEvents {
    constructor(pgPool) {
        this._pgPool = pgPool;
    }

    store(event){
        let name = event.name;
        let description = event.description;
        let loc = event.location.name;
        let source = 'Facebook';
        let from = event.date.start_date;
        let to = event.date.end_date;
        let latitude = event.location.latitude;
        let longitude = event.location.longitude;
        let web = 'https://www.facebook.com/' + event.fbId;
        let added_by = 1;

        let selectSql = `SELECT * FROM public.csld_events WHERE web = '${web}'`;

        let insertSql = `INSERT INTO public.csld_events ` +
                        `(name, description, loc, source, "from", "to", ` +
                        `latitude, longitude, web, added_by) VALUES ` +
                        `(${name}, ${description}, ${loc}, ${source}, ${from}, ${to} ` +
                        `${latitude}, ${longitude}, ${web}, ${added_by}`;

        this._pgPool.query(selectSql).then(result => {
            if(result.rows.length > 0) {
                return null;
            } else {
                return this._pgPool.query(insertSql);
            }
        });
    }
}
