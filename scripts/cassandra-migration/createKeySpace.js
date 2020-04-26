const cassandra = require('cassandra-driver');
const _ = require('lodash');
const logger = require('../../src/helpers/logger');

let client;

let cassandra_url = process.env.CASSANDRA_URL;
let cassandra_port = process.env.PORT;
let cassandra_username = process.env.CASSANDRA_USERNAME;
let cassandra_password = process.env.CASSANDRA_PASSWORD;
let cassandra_keyspace = process.env.CASSANDRA_KEYSPACE;
let cassandra_datacenter = process.env.CASSANDRA_DATA_CENTER;
let read_timeout = Number(process.env.CASSANDRA_READ_TIMEOUT);
let keyspace = `CREATE KEYSPACE IF NOT EXISTS ${cassandra_keyspace} WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor': 1}`;

let MANDATORY_VARS = [
  cassandra_url,
  cassandra_port,
  cassandra_username,
  cassandra_password,
  cassandra_keyspace,
  cassandra_datacenter
  ];

  const initCassandraClient = async () => {
      try {
          let missingMandatoryVars = _.filter(MANDATORY_VARS, currentVar => {
              return !currentVar;
          });

          if (missingMandatoryVars.length > 0) {
              logger.error({
                  msg: 'Missing mandatory environment variables...',
                  context: { missingMandatoryVars }
              });
              process.exit(1);
          }

          let authProvider = new cassandra.auth.PlainTextAuthProvider(
              cassandra_username,
              cassandra_password,
          );
          client = new cassandra.Client({
              contactPoints: cassandra_url.split(','),
              authProvider,
              localDataCenter: cassandra_datacenter,
              socketOptions: {
                  readTimeout: read_timeout,
              }
          });

          await client.connect();
          logger.info('Connected to Cassandra successfully');

          await createKeySpace();

          logger.info('Closing connection to Cassandra');
          await client.shutdown();

          logger.info('Keyspace created successfully');
          process.exit(0);
        
      } catch(err) {
          logger.error('Cassandra initialization error: ', err);
          process.exit(1);
      }
  };

  const createKeySpace = async () => {
      await client.execute(keyspace, [], { prepare: true });
  };

  return initCassandraClient();