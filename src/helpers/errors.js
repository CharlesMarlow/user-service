const errors = {
  GENERAL_ERROR: {
    code: 500,
    message: 'Unexpected error occurred',
  },
  EMAIL_ADDRESS_ALREADY_EXISTS: {
    code: 409,
    message: 'Email address already exists in the system',
  },
  USER_ID_IS_MISSING: {
    code: 404,
    message: 'User ID not found',
  },
  ADDRESS_ID_IS_MISSING: {
    code: 404,
    message: 'Address ID not found',
  },
};

const getError = (key) => {
  let error = errors[key];

  if (!error) {
    error = {
      ...errors.GENERAL_ERROR,
      more_info: key,
    };
  }
  return error;
};

module.exports = {
  GENERAL_ERROR: errors.GENERAL_ERROR,
  getError,
};
