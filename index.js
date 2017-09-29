const DataStores = require('./server/scripts/database/DataStores.js');
const WebApplication = require('./server/scripts/webapp/WebApplication');

const sqlURL = 'postgresql://csld:csld@10.0.75.2:5432/csld';
const hrajLarpUrl = 'postgresql://hrajlarp:hrajlarp@10.0.75.2:5432/hrajlarp';

const dataStores = new DataStores([sqlURL, hrajLarpUrl]);

const DbSimilarGames = require('./server/scripts/service/DbSImilarGames');

// Have only one logger for application.
const Logger = require('./server/scripts/tools/Logger.js');
const logger = new Logger;

dataStores.setup().then(databases => {
  const webapp = new WebApplication(databases[0], databases[1], logger);
  webapp.setup();
  const master = new DbSimilarGames(databases[0], logger);
  master.load();
  logger.info(`index.js WebApplication started`);
}).catch(err => {
  logger.error(`index.js `, err);
});

process.on('unhandledRejection', (reason, prom) => {
    logger.error('Unhandled rejection at:', prom, 'reason:', reason);
});
