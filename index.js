const DataStores = require('./scripts/database/DataStores.js');
const WebApplication = require('./scripts/webapp/WebApplication');

const sqlURL = 'postgresql://postgres:cyxwerno45981@localhost:5432/postgres';

const dataStores = new DataStores(sqlURL);

dataStores.setup().then(databases => {
  const webapp = new WebApplication(databases);
  webapp.setup();
}).catch(err => {
  console.log(err);
});
