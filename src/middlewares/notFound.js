const logger = require('../helpers/logger');

module.exports = (req, res, next) => {
  logger.info(`Request to ${req.originalUrl} does not exist, 404 returned`);
  res.status(404).send({
    msg: 'Not Found',
  });
  next();
}