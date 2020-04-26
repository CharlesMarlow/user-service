const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const swaggerValidator = require('openapi-validator-middleware');
const shutdown = require('graceful-shutdown-express');
const apiMetrics = require('prometheus-api-metrics');
const logger = require('./helpers/logger');
const env = require('../config/env').init();
const usersRoute = require('./routes/usersRouter');
// const addressesRoute = require('./routes/addressRouter');
const healthController = require('./controllers/healthController');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');
const cassandraClientUtil = require('./helpers/cassandraClient');

let server;

async function gracefulShutdownCallback() {
  logger.info({
    msg: 'Closing connections to extrenal services',
  });
  try {
    await cassandraClientUtil.closeConnection();
    process.exit();
  } catch (err) {
    logger.error({
      msg: 'Failed to close connections to external services',
    });
    process.exit(1);
  }
}

(async () => {
  try {
    await cassandraClientUtil.init();

    const swaggerPath = './docs/swagger.yaml';
    await swaggerValidator.init(swaggerPath);

    app.use(bodyParser.json());
    app.use('/health', healthController.checkHealth);
    app.use('/v1/users', usersRoute);
    // app.use('/v1/users', addressesRoute);
    app.use(apiMetrics());
    app.use(notFound);
    app.use(errorHandler);
    server = app.listen(env.PORT, () => logger.info({
      msg: `Users micro-service is listening on port ${env.PORT}!`,
    }));

    logger.info({
      msg: `Initialize Graceful-shutdown,
       LOAD_BALANCER_UPDATE_PERIOD: ${env.LOAD_BALANCER_UPDATE_PERIOD} , 
       SHUTDOWN_GRACE_TIMEOUT:${env.SHUTDOWN_GRACE_TIMEOUT} `,
    });
    const shutDownConfiguration = {
      server,
      newConnectionsTimeout: env.LOAD_BALANCER_UPDATE_PERIOD,
      shutdownTimeout: env.SHUTDOWN_GRACE_TIMEOUT,
      logger,
      events: ['SIGTERM', 'SIGINT'],
      callback: gracefulShutdownCallback,
    };
    await shutdown.registerShutdownEvent(shutDownConfiguration);
    logger.info({ msg: 'All required components initialized successfully' });
  } catch (err) {
    logger.error({ msg: 'Failed initializing service components', err });
    process.exit(1);
  }
})();

process.on('uncaughtException', (e) => {
  logger.error({
    msg: 'Unexpected server error', err: e,
  });
});
