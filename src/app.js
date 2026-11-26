const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const requestLogger = require('./middleware/requestLogger');
const rateLimiter = require('./middleware/rateLimiter');
const healthRouter = require('./routes/health');
const itemsRouter = require('./routes/items');
const suppliersRouter = require('./routes/suppliers');
const reportsRouter = require('./routes/reports');
const notificationsRouter = require('./routes/notifications');
const warehousesRouter = require('./routes/warehouses');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(rateLimiter());

app.use('/health', healthRouter);
app.use('/api/items', itemsRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/warehouses', warehousesRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

module.exports = app;
