const DataStores = require('./server/scripts/database/DataStores.js');
const WebApplication = require('./server/scripts/webapp/WebApplication');

const sqlURL = 'postgresql://csld:csld@10.0.75.2:5432/csld';
const hrajLarpUrl = 'postgresql://hrajlarp:hrajlarp@10.0.75.2:5432/hrajlarp';

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
