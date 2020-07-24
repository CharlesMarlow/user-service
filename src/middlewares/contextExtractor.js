/* eslint-disable camelcase */
const globalVariables = require('../helpers/globalVariables');
const logger = require('../helpers/logger');

module.exports = (req, res, next) => {
  const companyUserId = req.headers[globalVariables.COMPANY_USER_ID];
  const companyRequestId = req.headers[globalVariables.COMPANY_REQUEST_ID];
  const { user_id } = req.params;
  const { address_id } = req.params;

  req.ctx = {
    companyUserId,
    companyRequestId,
  };

  if (user_id) {
    req.ctx.userId = user_id;
  }

  if (address_id) {
    req.ctx.addressId = address_id;
  }

  logger.trace({
    context: req.ctx,
    message: 'Extracting context from request',
  });

  next();
};
