/* eslint-disable no-restricted-syntax */
const requestIp = require('request-ip');
const { Address4, Address6 } = require('ip-address');
const cassandraClient = require('./cassandraClient');
const logger = require('./logger');
const {
  INVALID_IP_ADDRESS,
  CREATED_DATE,
  UPDATED_DATE,
  DATE_TERMS_ACCEPTED,
  ADDRESS_CREATED,
  ADDRESS_UPDATED,
  USER_ID_IS_MISSING,
  ADDRESS_ID_IS_MISSING,
} = require('./globalVariables');

const dateTimeFields = [
  CREATED_DATE,
  UPDATED_DATE,
  DATE_TERMS_ACCEPTED,
  ADDRESS_CREATED,
  ADDRESS_UPDATED,
];

const getIpAddressFromRequest = (req, next) => {
  const ipAddress = requestIp.getClientIp(req);

  try {
    if (!ipAddress) {
      throw INVALID_IP_ADDRESS;
    }

    const addressV4 = new Address4(ipAddress);

    if (addressV4.isValid()) {
      return ipAddress;
    }

    const addressV6 = new Address6(ipAddress);

    if (addressV6.isValid()) {
      return ipAddress;
    }

    throw INVALID_IP_ADDRESS;
  } catch (error) {
    if (error === INVALID_IP_ADDRESS) {
      logger.error({
        context: req.ctx,
        msg: `Ip address ${ipAddress} is invalid`,
      });
      return ipAddress;
    }
    logger.error({
      error,
      context: req.ctx,
      msg: 'An error occurred in getIpAddressFromRequest',
    });
    return next(error);
  }
};

const throwErrorIfEmpty = (resource, error = USER_ID_IS_MISSING) => {
  if (!resource || resource.length === 0) {
    throw new Error(error);
  }
};

const mapResourceToResponse = (resource) => {
  const currentResource = resource;
  for (const [key] of Object.entries(currentResource)) {
    if (currentResource[key] === null) {
      delete currentResource[key];
    }
    // Prepare dateof() fields in Cassandra to match swagger's date-time format
    dateTimeFields.forEach((field) => {
      if (currentResource[key] && key === field) {
        currentResource[key] = new Date(currentResource[key]).toISOString();
      }
    });
  }
  return currentResource;
};

const setMissingId = async (userId, addressId) => {
  const user = await cassandraClient.getUserById(userId);

  if (!user) {
    throw new Error(USER_ID_IS_MISSING);
  } else {
    const address = await cassandraClient.getAddressById(userId, addressId);

    if (!address) {
      throw new Error(ADDRESS_ID_IS_MISSING);
    }
  }
};

module.exports = {
  getIpAddressFromRequest,
  throwErrorIfEmpty,
  mapResourceToResponse,
  setMissingId,
};
