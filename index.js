const DataStores = require('./scripts/database/DataStores.js');
const WebApplication = require('./scripts/webapp/WebApplication');

const mongoURI = 'mongodb://localhost:27017/test';

const dataStores = new DataStores(mongoURI);

const webapp = new WebApplication(dataStores);

webapp.setup();
