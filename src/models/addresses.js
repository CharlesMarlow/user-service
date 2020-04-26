const uuid = require('uuid');
const logger = require('../helpers/logger');
const {
  throwErrorIfEmpty,
  mapResourceToResponse,
  setMissingId,
} = require('../helpers/commonFunctions');
const cassandraClient = require('../helpers/cassandraClient');

const postAddress = async (userId, addressToPost, context) => {
  const ctx = context;
  try {
    // Check user exists in the system
    const userExists = await cassandraClient.getUserById(userId);

    // Generate an address ID
    const addressId = uuid.v4();
    ctx.addressId = addressId;

    throwErrorIfEmpty(userExists);

    logger.info({
      message: 'Creating a new address',
      ctx,
    });
    await cassandraClient.postAddress(userId, addressId, addressToPost);

    // Respond with the newly created address
    const addressResource = await cassandraClient.getAddressById(userId, addressId);
    return mapResourceToResponse(addressResource);
  } catch (error) {
    logger.error({
      message: 'Failed to post a user address',
      error,
      ctx,
    });
    throw error;
  }
};

const getAddresses = async (userId, context) => {
  logger.info({
    message: 'Getting user addresses',
    context,
  });

  try {
    // Check user exists in the system
    const userExists = await cassandraClient.getUserById(userId);
    throwErrorIfEmpty(userExists);

    return await cassandraClient.getAddresses(userId);
  } catch (error) {
    logger.error({
      message: 'Failed to user addresses',
      error,
      context,
    });
    throw error;
  }
};

const getAddressById = async (userId, addressId, context) => {
  try {
    logger.info({
      message: 'Getting address by ID',
      context,
    });

    const addressResource = await cassandraClient.getAddressById(userId, addressId);
    if (!addressResource) {
      await setMissingId(userId, addressId);
    }

    return mapResourceToResponse(addressResource);
  } catch (error) {
    logger.error({
      message: 'Failed to get address by ID',
      error,
      context,
    });
    throw error;
  }
};

const putAddressById = async (userId, addressId, addressToPut, context) => {
  try {
    logger.info({
      message: 'Putting user address by ID',
      context,
    });

    // Check existence of the address to be updated
    const existingResource = await cassandraClient.getAddressById(userId, addressId);

    if (!existingResource) {
      await setMissingId(userId, addressId);
    }

    // Updating the exisiting address via PUT method
    await cassandraClient.putAddressById(userId, addressId, addressToPut);

    // Respond with the newly updated address
    const addressResource = await cassandraClient.getAddressById(userId, addressId);
    return mapResourceToResponse(addressResource);
  } catch (error) {
    logger.error({
      message: 'Failed to put address by ID',
      error,
      context,
    });
    throw error;
  }
};

const patchAddressById = async (userId, addressId, addressToPatch, context) => {
  try {
    logger.info({
      message: 'Patching user address by ID',
      context,
    });
    // Check user address exists
    const oldAddress = await cassandraClient.getAddressById(userId, addressId);
    if (!oldAddress) {
      await setMissingId(userId, addressId);
    }

    // Adding fresh data to the address resource
    await cassandraClient.patchAddressById(userId, addressId, addressToPatch);

    // Respond with the newly updated address
    return await cassandraClient.getAddressById(userId, addressId);
  } catch (error) {
    logger.error({
      message: 'Failed to patch address by ID',
      error,
      context,
    });
    throw error;
  }
};

const deleteAddressById = async (userId, addressId, context) => {
  try {
    logger.info({
      message: 'Getting address by ID',
      context,
    });
    // Check user address exists
    const addressResource = await cassandraClient.getAddressById(userId, addressId);

    if (!addressResource) {
      await setMissingId(userId, addressId);
    }

    // Send resource for deletion
    logger.info({
      message: 'Deleting address by ID',
      context,
    });
    await cassandraClient.deleteAddressById(userId, addressId);
  } catch (error) {
    logger.error({
      message: 'Failed to delete address by ID',
      error,
      context,
    });
    throw error;
  }
};

module.exports = {
  postAddress,
  getAddresses,
  getAddressById,
  putAddressById,
  patchAddressById,
  deleteAddressById,
};
