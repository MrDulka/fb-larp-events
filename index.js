const DataStores = require('./scripts/database/DataStores.js');
const WebApplication = require('./scripts/webapp/WebApplication');

const mongoURL = 'mongodb://localhost:27017/test';
const sqlURL = 'postgresql://postgres:cyxwerno45981@localhost:5432/postgres';

const dataStores = new DataStores(mongoURL, sqlURL);

dataStores.setup().then(databases => {
  const webapp = new WebApplication(databases);
  webapp.setup();
});
