/* eslint-disable consistent-return */
const usersModel = require('../models/users');
const logger = require('../helpers/logger');
const commonFunctions = require('../helpers/commonFunctions');

let result;

module.exports = {
  postUser: async (req, res, next) => {
    const { body } = req;
    const context = req.ctx;
    const { companyUserId } = context;

    logger.trace({
      message: 'Starting the postUser controller',
      context,
    });

    const userResource = {
      email_address: body.email_address,
      first_name: body.first_name,
      last_name: body.last_name,
      marketing_opt_in_accepted: body.marketing_opt_in_accepted,
      terms_accepted: body.terms_accepted,
      phone_number: body.phone_number,
      additional_values: body.additional_values,
    };

    try {
      userResource.signup_ip_address = commonFunctions.getIpAddressFromRequest(req);
      result = await usersModel.postUser(companyUserId, userResource, context);
      res.status(201).send(result);
    } catch (error) {
      return next(error);
    }
  },
  getUserById: async (req, res, next) => {
    const context = req.ctx;
    const { userId } = context.userId;

    logger.trace({
      message: 'Starting the getUserById controller',
      context,
    });
    try {
      result = await usersModel.getUserById(userId, context);
      res.send(result);
    } catch (error) {
      return next(error);
    }
  },
  putUserById: async (req, res, next) => {
    const { body } = req;
    const context = req.ctx;
    const { userId } = context.userId;

    logger.trace({
      message: 'Starting in the putUserById controller',
      context,
    });

    const userResource = {
      email_address: body.email_address,
      first_name: body.first_name,
      last_name: body.last_name,
      marketing_opt_in_accepted: body.marketing_opt_in_accepted,
      phone_number: body.phone_number,
      additional_values: body.additional_values,
      user_id_updated: userId,
    };

    try {
      result = await usersModel.putUserById(userId, userResource, context);
      res.send(result);
    } catch (error) {
      return next(error);
    }
  },
  patchUserById: async (req, res, next) => {
    const { body } = req;
    const context = req.ctx;
    const { userId } = context.userId;

    logger.trace({
      message: 'Starting in the patchUserById controller',
      context,
    });

    const userResource = {
      email_address: body.email_address,
      first_name: body.first_name,
      last_name: body.last_name,
      marketing_opt_in_accepted: body.marketing_opt_in_accepted,
      phone_number: body.phone_number,
      additional_values: body.additional_values,
      user_id_updated: userId,
    };

    try {
      result = await usersModel.patchUserById(userId, userResource, context);
      res.send(result);
    } catch (error) {
      return next(error);
    }
  },
};
