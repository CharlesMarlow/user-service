const express = require('express');

const router = express.Router();
const swaggerValidator = require('openapi-validator-middleware');
const contextExtractor = require('../middlewares/contextExtractor');
const { setDefault } = require('../middlewares/requestModifier');
const {
  postUser,
  getUserById,
  putUserById,
  patchUserById,
} = require('../controllers/users');
const {
  postAddress,
  getAddresses,
  getAddressById,
  putAddressById,
  patchAddressById,
  deleteAddressById,
} = require('../controllers/addresses');

// v1/users
router.post('/', swaggerValidator.validate, contextExtractor, setDefault, postUser);

// v1/users/:userId
router.get('/:userId', swaggerValidator.validate, contextExtractor, getUserById);

router.put('/:userId', swaggerValidator.validate, contextExtractor, putUserById);

router.patch('/:userId', swaggerValidator.validate, contextExtractor, patchUserById);

// v1/users/:userId/addresses
router.post('/:userId/addresses', swaggerValidator.validate, contextExtractor, postAddress);

router.get('/:userId/addresses', swaggerValidator.validate, contextExtractor, getAddresses);

// v1/users/:userId/addresses/:addressId
router.get('/:userId/addresses/:addressId', swaggerValidator.validate, contextExtractor, getAddressById);

router.put('/:userId/addresses/:addressId', swaggerValidator.validate, contextExtractor, putAddressById);

router.patch('/:userId/addresses/:addressId', swaggerValidator.validate, contextExtractor, patchAddressById);

router.delete('/:userId/addresses/:addressId', swaggerValidator.validate, contextExtractor, deleteAddressById);
module.exports = router;
