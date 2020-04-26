const _ = require('lodash');
const {
  CASSANDRA_URL,
  CASSANDRA_PORT,
  CASSANDRA_USERNAME,
  CASSANDRA_PASSWORD,
  CASSANDRA_KEYSPACE,
} = require('../src/helpers/globalVariables');

const MANDATORY_VARS = [
  CASSANDRA_URL,
  CASSANDRA_PORT,
  CASSANDRA_USERNAME,
  CASSANDRA_PASSWORD,
  CASSANDRA_KEYSPACE,
];

const env = {};

env.init = () => {
  const missingFields = _.filter(MANDATORY_VARS, (currentVar) => !process.env[currentVar]);

  env.LOGGER_LEVEL = process.env.LOGGER_LEVEL;
  // eslint-disable-next-line global-require
  const logger = require('../src/helpers/logger');

  if (missingFields.length > 0) {
    logger.error({
      message: 'Missing mandatory environment variables',
      context: { missingFields },
    });
  }

  // Common usage
  env.SERVER_URL = process.env.SERVER_URL;
  env.PORT = Number(process.env.PORT) || 3000;
  env.LOAD_BALANCER_UPDATE_PERIOD = Number(process.env.LOAD_BALANCER_UPDATE_PERIOD) || 7;
  env.SHUTDOWN_GRACE_TIMEOUT = Number(process.env.SHUTDOWN_GRACE_TIMEOUT) || 10;
  env.CASSANDRA_READ_TIMEOUT = Number(process.env.CASSANDRA_READ_TIMEOUT);

  // Cassandra variables
  env.CASSANDRA_URL = process.env.CASSANDRA_URL;
  env.CASSANDRA_PORT = Number(process.env.CASSANDRA_PORT);
  env.CASSANDRA_DATA_CENTER = process.env.CASSANDRA_DATA_CENTER;
  env.CASSANDRA_USERNAME = process.env.CASSANDRA_USERNAME;
  env.CASSANDRA_PASSWORD = process.env.CASSANDRA_PASSWORD;
  env.CASSANDRA_KEYSPACE = process.env.CASSANDRA_KEYSPACE;
  env.CASSANDRA_FULL_PATH = `${env.CASSANDRA_URL}:${env.CASSANDRA_PORT}`;

  return env;
};

module.exports = env;
