const uuid = require('uuid');
const logger = require('../helpers/logger');
const cassandraClient = require('../helpers/cassandraClient');
const {
  mapResourceToResponse,
  throwErrorIfEmpty,
} = require('../helpers/commonFunctions');
const { EMAIL_ADDRESS_ALREADY_EXISTS } = require('../helpers/globalVariables');

const postUser = async (companyUserId, userResource, context) => {
  const ctx = context;
  try {
    // Check if user already exists
    const userExists = await cassandraClient.getUserByEmail(userResource.email_address);

    // Generate a user ID
    const userId = uuid.v4();
    ctx.userId = userId;

    if (userExists.length === 0) {
      logger.info({
        msg: 'Creating a new user',
        ctx,
      });
      await cassandraClient.postUser(userId, companyUserId, userResource);

      // Respond with the newly created user
      logger.info({
        msg: 'Getting user by ID',
        ctx,
      });
      const resource = await cassandraClient.getUserById(userId);
      return mapResourceToResponse(resource);
    }
    throw new Error(EMAIL_ADDRESS_ALREADY_EXISTS);
  } catch (error) {
    logger.error({
      msg: 'Failed to create new user',
      error,
      ctx,
    });
    throw error;
  }
};

const getUserById = async (userId, context) => {
  try {
    logger.info({
      msg: 'Getting user by ID',
      context,
    });

    const resource = await cassandraClient.getUserById(userId);
    throwErrorIfEmpty(resource);

    return mapResourceToResponse(resource);
  } catch (error) {
    logger.error({
      msg: 'Failed to get user by ID',
      error,
      context,
    });
    throw error;
  }
};

const putUserById = async (userId, userResource, context) => {
  try {
    logger.info({
      message: 'Checking if user exists',
      context,
    });
    const oldResource = await cassandraClient.getUserById(userId);
    throwErrorIfEmpty(oldResource);

    // Adding fresh data to the user
    logger.info({
      message: 'Adding new user data',
      context,
    });
    await cassandraClient.putUserById(userId, userResource);

    // Fetching updated user data
    const resource = await cassandraClient.getUserById(userId);
    return mapResourceToResponse(resource);
  } catch (error) {
    logger.error({
      message: 'Failed to put user by ID',
      error,
      context,
    });
    throw error;
  }
};

const patchUserById = async (userId, userResource, context) => {
  try {
    logger.info({
      message: 'Checking if user exists',
      context,
    });
    const oldResource = await cassandraClient.getUserById(userId);
    throwErrorIfEmpty(oldResource);

    // Adding fresh data to user
    logger.info({
      message: 'Patching user by ID',
      context,
    });
    await cassandraClient.patchUserById(userId, userResource);

    // Fetching updated user data
    return await cassandraClient.getUserById(userId);
  } catch (error) {
    logger.error({
      message: 'Failed to patch user by ID',
      error,
      context,
    });
    throw error;
  }
};

module.exports = {
  postUser,
  getUserById,
  putUserById,
  patchUserById,
};
