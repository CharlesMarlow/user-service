const globalVariables = require('../helpers/globalVariables');
const logger = require('../helpers/logger');

module.exports = (req, res, next) => {
  const companyUserId = req.headers[globalVariables.COMPANY_USER_ID];
  const companyRequestId = req.headers[globalVariables.COMPANY_REQUEST_ID];
  const userId = req.params;
  const addressId = req.params;

  req.ctx = {
    companyUserId,
    companyRequestId,
  };

  if (userId) {
    req.ctx.userId = userId;
  }

  if (addressId) {
    req.ctx.addressId = addressId;
  }

  logger.trace({
    context: req.ctx,
    message: 'Extracting context from request',
  });

  next();
};
