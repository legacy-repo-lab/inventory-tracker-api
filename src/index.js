const app = require('./app');
const config = require('./config');

app.listen(config.port, function () {
  console.log('Inventory Tracker API listening on port ' + config.port);
});
