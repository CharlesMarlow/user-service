const express = require('express');

const router = express.Router();
const swaggerValidation = require('openapi-validator-middleware');
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
router.post('/', swaggerValidation.validate, contextExtractor, setDefault, postUser);

// v1/users/:user_id
router.get('/:user_id', swaggerValidation.validate, contextExtractor, getUserById);

router.put(
  '/:user_id',
  swaggerValidation.validate,
  contextExtractor,
  putUserById,
);

router.patch(
  '/:user_id',
  swaggerValidation.validate,
  contextExtractor,
  patchUserById,
);

// v1/users/:user_id/addresses
router.post(
  '/:user_id/addresses',
  swaggerValidation.validate,
  contextExtractor,
  postAddress,
);

router.get(
  '/:user_id/addresses',
  swaggerValidation.validate,
  contextExtractor,
  getAddresses,
);

// v1/users/:user_id/addresses/:address_id
router.get(
  '/:user_id/addresses/:address_id',
  swaggerValidation.validate,
  contextExtractor,
  getAddressById,
);

router.put(
  '/:user_id/addresses/:address_id',
  swaggerValidation.validate,
  contextExtractor,
  putAddressById
);

router.patch(
  '/:user_id/addresses/:address_id',
  swaggerValidation.validate,
  contextExtractor,
  patchAddressById
);

router.delete(
  '/:user_id/addresses/:address_id',
  swaggerValidation.validate,
  contextExtractor,
  deleteAddressById,
);
module.exports = router;
