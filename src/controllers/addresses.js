/* eslint-disable consistent-return */
const addressesModel = require('../models/addresses');
const logger = require('../helpers/logger');

let result;

module.exports = {
  postAddress: async (req, res, next) => {
    const { body } = req;
    const context = req.ctx;
    const { userId } = context;
    const addressToPost = {
      nickname: body.nickname,
      address_line_1: body.address_line_1,
      address_line_2: body.address_line_2,
      address_line_3: body.address_line_3,
      country_code: body.country_code,
      state_province: body.state_province,
      city: body.city,
      postal_code: body.postal_code,
      address_type: body.address_type,
      user_id_created: userId,
    };

    logger.trace({
      message: 'Starting in the postAddress controller',
      context,
    });

    try {
      result = await addressesModel.postAddress(userId, addressToPost, context);
      res.status(201).send(result);
    } catch (error) {
      return next(error);
    }
  },
  getAddresses: async (req, res, next) => {
    const context = req.ctx;
    const { userId } = context;

    logger.trace({
      message: 'Starting in the getAddresses controller',
      context,
    });

    try {
      result = await addressesModel.getAddresses(userId, context);
      res.send(result);
    } catch (error) {
      return next(error);
    }
  },
  getAddressById: async (req, res, next) => {
    const context = req.ctx;
    const { userId } = context;
    const { addressId } = context;

    logger.trace({
      message: 'Starting in the getAddressById controller',
      context,
    });

    try {
      result = await addressesModel.getAddressById(userId, addressId, context);
      res.send(result);
    } catch (error) {
      return next(error);
    }
  },
  putAddressById: async (req, res, next) => {
    const { body } = req;
    const context = req.ctx;
    const { userId } = context;
    const { addressId } = context;
    const addressToPut = {
      nickname: body.nickname,
      address_line_1: body.address_line_1,
      address_line_2: body.address_line_2,
      address_line_3: body.address_line_3,
      country_code: body.country_code,
      state_province: body.state_province,
      city: body.city,
      postal_code: body.postal_code,
      address_type: body.address_type,
      user_id_updated: userId,
    };

    logger.trace({
      message: 'Starting in the putAddressById controller',
      context,
    });

    try {
      result = await addressesModel.putAddressById(userId, addressId, addressToPut, context);
      res.send(result);
    } catch (error) {
      return next(error);
    }
  },
  patchAddressById: async (req, res, next) => {
    const { body } = req;
    const context = req.ctx;
    const { userId } = context;
    const { addressId } = context;
    const addressToPatch = {
      nickname: body.nickname,
      address_line_1: body.address_line_1,
      address_line_2: body.address_line_2,
      address_line_3: body.address_line_3,
      country_code: body.country_code,
      state_province: body.state_province,
      city: body.city,
      postal_code: body.postal_code,
      address_type: body.address_type,
      user_id_updated: userId,
    };

    logger.trace({
      message: 'Starting in the patchAddressById controller',
      context,
    });

    try {
      result = await addressesModel.patchAddressById(userId, addressId, addressToPatch, context);
      res.send(result);
    } catch (error) {
      return next(error);
    }
  },
  deleteAddressById: async (req, res, next) => {
    const context = req.ctx;
    const { userId } = context;
    const { addressId } = context;

    logger.trace({
      message: 'Starting in the deleteAddressById controller',
      context,
    });

    try {
      await addressesModel.deleteAddressById(userId, addressId, context);
      res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
};
