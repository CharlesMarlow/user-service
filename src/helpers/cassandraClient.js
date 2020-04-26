const cassandra = require('cassandra-driver');
const env = require('../../config/env');
const logger = require('./logger');

const prepare = { prepare: true };
let client;

// Initialize Cassandra and connect to DB
const init = async () => {
  try {
    logger.info({
      message: 'Adding connection to Cassandra',
    });

    const authProvider = new cassandra.auth.PlainTextAuthProvider(
      env.CASSANDRA_USERNAME,
      env.CASSANDRA_PASSWORD,
    );

    // Set up the client
    client = new cassandra.Client({
      contactPoints: env.CASSANDRA_FULL_PATH.split(','),
      keyspace: env.CASSANDRA_KEYSPACE,
      authProvider,
      localDataCenter: env.CASSANDRA_DATA_CENTER,
      socketOptions: {
        readTimeout: env.CASSANDRA_READ_TIMEOUT,
      },
    });

    // Connect to Cassandra and throw error on failure
    await client.connect();
    logger.info({ message: 'Connected to Cassandra successfully' });
  } catch (error) {
    logger.error({
      msg: 'Failed to connect to Cassandra',
      error,
    });

    throw error;
  }
};

// User transactions
const postUser = async (userId, userIdCreated, userResource) => {
  const query = `INSERT INTO users (id, user_id_created, created_date, 
    user_id_updated, updated_date, email_address, first_name, last_name,
    marketing_opt_in_accepted, terms_accepted, date_terms_accepted,
    signup_ip_address, phone_number, additional_values)
    VALUES (?, ?, dateof(now()), ?, dateof(now()), ?, ?, ?, ?, ?, dateof(now()), ?, ?, ?)`;

  const params = [
    userId,
    userIdCreated,
    userIdCreated,
    userResource.email_address,
    userResource.first_name,
    userResource.last_name,
    userResource.marketing_opt_in_accepted,
    userResource.terms_accepted,
    userResource.signup_ip_address,
    userResource.phone_number,
    userResource.additional_values,
  ];

  await client.execute(query, params, prepare);
};

const getUserById = async (userId) => {
  const query = 'SELECT * FROM users WHERE id = ? LIMIT 1';

  const result = await client.execute(query, [userId], prepare);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const query = 'SELECT email_address FROM users_by_email WHERE email_address = ? LIMIT 1';

  const result = await client.execute(query, [email], prepare);
  return result.rows;
};

const putUserById = async (userId, userResource) => {
  const query = `UPDATE users SET user_id_updated = ?, updated_date = dateof(now()),
  email_address = ?, first_name = ?, last_name = ?, marketing_opt_in_accepted = ?, 
  phone_number = ?, additional_values = ? WHERE id = ?`;

  // Set additional values to nul if it doesn't exist to override previous data
  const params = [
    userResource.user_id_updated,
    userResource.email_address,
    userResource.first_name,
    userResource.last_name,
    userResource.marketing_opt_in_accepted,
    userResource.phone_number ? userResource.phone_number : null,
    userResource.additional_values ? userResource.additional_values : null,
    userId,
  ];

  await client.execute(query, params, prepare);
};

const patchUserById = async (userId, userResource) => {
  const query = `UPDATE users SET user_id_updated = ?, updated_date = dateof(now()),
  email_address = ?, first_name = ?, last_name = ?, marketing_opt_in_accepted = ?,
  phone_number = ?, additional_values = ? WHERE id = ?`;

  const params = [
    userResource.user_id_updated,
    userResource.email_address,
    userResource.first_name,
    userResource.last_name,
    userResource.marketing_opt_in_accepted,
    userResource.phone_number,
    userResource.additional_values,
    userId,
  ];

  await client.execute(query, params, prepare);
};

// User addresses transactions
const postAddress = async (userId, addressId, addressToPost) => {
  const query = `INSERT INTO user_addresses (user_id, id, nickname,
    address_line_1, address_line_2, address_line_3, country_code,
    state_province, city, postal_code, address_type, address_created,
    address_updated, user_id_created, user_id_updated) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, dateof(now()), dateof(now()), ?, ?)`;

  const params = [
    userId,
    addressId,
    addressToPost.nickname,
    addressToPost.address_line_1,
    addressToPost.address_line_2,
    addressToPost.address_line_3,
    addressToPost.country_code,
    addressToPost.state_province,
    addressToPost.city,
    addressToPost.postal_code,
    addressToPost.address_type,
    addressToPost.user_id_created,
    addressToPost.user_id_created,
  ];

  await client.execute(query, params, prepare);
};

const getAddresses = async (userId) => {
  const query = 'SELECT * FROM user_addresses WHERE user_id = ?';

  const result = await client.execute(query, [userId], prepare);
  return result.rows;
};

const getAddressById = async (userId, addressId) => {
  const query = 'SELECT * FROM user_addresses WHERE user_id = ? AND id = ? LIMIT 1';

  const result = await client.execute(query, [userId, addressId], prepare);
  return result.rows[0];
};

const putAddressById = async (userId, addressId, addressToPut) => {
  const query = `UPDATE user_addresses SET user_id_updated = ?, nickname = ?,
  address_updated = dateof(now()), address_line_1 = ?, address_line_2 = ?,
  address_line_3 = ?, country_code = ?, state_province = ?, city = ?,
  postal_code = ?, address_type = ? WHERE user_id = ? AND id = ?`;

  const params = [
    addressToPut.user_id_updated,
    addressToPut.nickname ? addressToPut.nickname : null,
    addressToPut.address_line_1,
    addressToPut.address_line_2 ? addressToPut.address_line_2 : null,
    addressToPut.address_line_3 ? addressToPut.address_line_3 : null,
    addressToPut.country_code,
    addressToPut.state_province ? addressToPut.state_province : null,
    addressToPut.city,
    addressToPut.postal_code,
    addressToPut.address_type ? addressToPut.address_type : null,
    userId,
    addressId,
  ];

  await client.execute(query, params, prepare);
};

const patchAddressById = async (userId, addressId, addressToPatch) => {
  const query = `UPDATE user_addresses SET user_id_updated = ?, nickname = ?,
  address_updated = dateof(now()), address_line_1 = ?, address_line_2 = ?,
  address_line_3 = ?, country_code = ?, state_province = ?, city = ?,
  postal_code = ?, address_type = ? WHERE user_id = ? AND id = ?`;

  const params = [
    addressToPatch.user_id_updated,
    addressToPatch.nickname,
    addressToPatch.address_line_1,
    addressToPatch.address_line_2,
    addressToPatch.address_line_3,
    addressToPatch.country_code,
    addressToPatch.state_province,
    addressToPatch.city,
    addressToPatch.postal_code,
    addressToPatch.address_type,
    userId,
    addressId,
  ];

  await client.execute(query, params, prepare);
};

const deleteAddressById = async (userId, addressId) => {
  const query = 'DELETE FROM user_addresses WHERE user_id = ? AND id = ?';

  await client.execute(query, [userId, addressId]);
};

// Close connection to Cassandra and throw error on failure
const closeConnection = async () => {
  try {
    await client.shutdown();
  } catch (error) {
    logger.error({
      msg: 'Failed to shutdown Cassandra connection',
      error,
    });

    throw error;
  }
};

module.exports = {
  init,
  closeConnection,
  postUser,
  getUserById,
  getUserByEmail,
  putUserById,
  patchUserById,
  postAddress,
  getAddresses,
  getAddressById,
  putAddressById,
  patchAddressById,
  deleteAddressById,
};
