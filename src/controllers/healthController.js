const pkginfo = require('pkginfo');

const logger = require('../helpers/logger.js');

module.exports.checkHealth = (req, res) => {
  logger.trace('Checking health', pkginfo);
  const message = {
    version: module.exports.version,
    message: 'OK',
  };
  res.json(message);
};
