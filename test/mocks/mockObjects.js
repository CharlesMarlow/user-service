// Resources
const userResource = {
    "id": "389afdcc-4e85-47c3-b8ab-1aeab684b3fe",
    "additional_values": {
        "birthday": "2/10/2000"
    },
    "created_date": "2020-05-03T13:37:48.096Z",
    "date_terms_accepted": "2020-05-03T13:37:48.096Z",
    "email_address": "c@test.com",
    "first_name": "Zinedine",
    "last_name": "Zidane",
    "marketing_opt_in_accepted": true,
    "phone_number": "555-1111-111",
    "signup_ip_address": "::ffff:127.0.0.1",
    "terms_accepted": true,
    "updated_date": "2020-05-03T13:37:48.096Z",
    "user_id_created": "acab9295-9a77-446a-9911-161de6e588a7",
    "user_id_updated": "acab9295-9a77-446a-9911-161de6e588a7"
};

const userId = '389afdcc-4e85-47c3-b8ab-1aeab684b3fe';

const addressId = '5dc1ecf5-d363-4f96-8df2-d3e3a6e35910';

// Cassandra queries
const postUserQuery = `INSERT INTO users (id, user_id_created, created_date, 
    user_id_updated, updated_date, email_address, first_name, last_name,
    marketing_opt_in_accepted, terms_accepted, date_terms_accepted,
    signup_ip_address, phone_number, additional_values)
    VALUES (?, ?, dateof(now()), ?, dateof(now()), ?, ?, ?, ?, ?, dateof(now()), ?, ?, ?)`;

module.exports = {
    userResource,
    userId,
    addressId,
    postUserQuery,
}