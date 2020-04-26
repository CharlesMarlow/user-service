const express = require('express');

const router = express.Router();
const swaggerValidation = require('openapi-validator-middleware');
const contextExtractor = require('../middlewares/contextExtractor');
const {
  postAddress,
  getAddresses,
  getAddressById,
  putAddressById,
  patchAddressById,
  deleteAddressById,
} = require('../controllers/addresses');

// v1/users/:userId/addresses
router.post('/:userId/addresses', swaggerValidation.validate, contextExtractor, postAddress);

router.get('/:userId/addresses', swaggerValidation.validate, contextExtractor, getAddresses);

// v1/users/:userId/addresses/:addressId
router.get('/:userId/addresses/:addressId', swaggerValidation.validate, contextExtractor, getAddressById);

router.put('/:userId/addresses/:addressId', swaggerValidation.validate, contextExtractor, putAddressById);

router.patch('/:userId/addresses/:addressId', swaggerValidation.validate, contextExtractor, patchAddressById);

router.delete('/:userId/addresses/:addressId', swaggerValidation.validate, contextExtractor, deleteAddressById);
module.exports = router;
