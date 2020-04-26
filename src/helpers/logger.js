const bunyan = require('bunyan');
const env = require('../../config/env');

const logger = bunyan.createLogger({
  name: 'usersServiceLogger',
  level: env.LOGGER_LEVEL,
});

function customLogToBunyan(data, level) {
  if (typeof data === 'string') {
    logger[level](data);
  } else {
    const context = data.context || {};
    let error;
    let stack;
    if (data.err && (data.err.msg || data.err.message)) {
      error = data.err.msg || data.err.message;
      if (data.err.stack) {
        stack = data.err.stack;
      }
    } else {
      error = data.err;
    }

    let logData;
    if (error) {
      logData = Object.assign(context, { err: error, stack });
    } else {
      logData = context;
    }

    logData = Object.keys(logData).length ? logData : undefined;
    if (logData) {
      logger[level](logData, data.msg || data.message);
    } else {
      logger[level](data.msg || data.message);
    }
  }
}

const customLogger = {
  trace: (data) => customLogToBunyan(data, 'trace'),
  info: (data) => customLogToBunyan(data, 'info'),
  error: (data) => customLogToBunyan(data, 'error'),
};

module.exports = customLogger;
