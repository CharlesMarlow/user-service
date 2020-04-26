const swaggerValidator = require('openapi-validator-middleware');
const errors = require('../helpers/errors');
const logger = require('../helpers/logger');

const { GENERA_ERROR } = errors;

const headerErrorValidationMatch = (currentError) => {
  const re1 = '(\\.)';
  const re2 = '(headers)';
  const re3 = '(.*)';
  return new RegExp(re1 + re2 + re3, ['i']).exec(currentError);
};

const buildMoreInfo = (currentError) => {
  const { dataPath, message } = currentError;
  let res = `${dataPath} ${message}`;
  const headerError = headerErrorValidationMatch(dataPath);

  if (!headerError) {
    res = `request${res}`;
  } else {
    res = `request.body${res}`;
  }
  return res;
};

module.exports = (err, req, res, next) => {
  try {
    logger.error({
      message: 'An error occurred',
      err,
      context: req.ctx,
    });

    let error = errors.getError(GENERA_ERROR);

    if (err instanceof swaggerValidator.InputValidationError) {
      const currentError = err.errors[0];
      const moreInfo = buildMoreInfo(currentError);

      res.status(400).json({
        message: 'Input Validation Error',
        more_info: moreInfo,
      });
    } else if (err && err.message) {
      // Expected error
      error = errors.getError(err.message);

      res.status(error.code).json({
        message: error.message,
        more_info: error.more_info,
      });
    } else {
      logger.error({
        message: 'Unexpected error',
        err,
        context: req.ctx,
      });
      res.status(errors.GENERAL_ERROR.code).json({
        message: errors.GENERAL_ERROR.message,
      });
    }
  } catch (error) {
    logger.error({
      message: 'An error occurred in the error handler',
      error,
      context: req.ctx,
    });
    res.status(errors.GENERAL_ERROR.code).json({
      message: errors.GENERAL_ERROR.message,
    });
    next();
  }
};
