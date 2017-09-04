
class SqlEvents {
    constructor(pgPool) {
        this._pgPool = pgPool;
    }

    store(neco){
        let selectSql = `SELECT * FROM public.csld_events WHERE neco = '${neco}'`;
        let insertSql = `INSERT INTO public.csld_events () VALUES ()`;
        this._pgPool.query(selectSql).then(result => {
            if(result.rows.length > 0) {
                return null;
            } else {
                return this._pgPool.query(insertSql);
            }
        });
    }
}