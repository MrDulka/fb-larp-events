const DataStores = require('./server/scripts/database/DataStores.js');
const WebApplication = require('./server/scripts/webapp/WebApplication');

let config = require('home/balda/config');
const sqlURL = config.sqlUrl;
const hrajLarpUrl = config.hrajLarpUrl;

const dataStores = new DataStores([sqlURL, hrajLarpUrl]);

// Have only one logger for application.
const Logger = require('./server/scripts/tools/Logger.js');
const logger = new Logger;

dataStores.setup().then(databases => {
  const webapp = new WebApplication(databases[0], databases[1], logger);
  webapp.setup();
  logger.info(`index.js WebApplication started`);
}).catch(err => {
  logger.error(`index.js `, err);
});

process.on('unhandledRejection', (reason, prom) => {
    logger.error('Unhandled rejection at:', prom, 'reason:', reason);
});
