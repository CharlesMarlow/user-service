CREATE TABLE IF NOT EXISTS users (
    id uuid,
    user_id_created uuid,
    created_date TIMESTAMP,
    user_id_updated uuid,
    updated_date TIMESTAMP,
    email_address TEXT,
    first_name TEXT,
    last_name TEXT,
    marketing_opt_in_accepted BOOLEAN,
    terms_accepted BOOLEAN,
    date_terms_accepted TIMESTAMP,
    signup_ip_address TEXT,
    phone_number VARCHAR,
    additional_values map<text,text>,
    PRIMARY KEY(id)
);

--- 

CREATE MATERIALIZED VIEW users_by_email
    AS SELECT email_address, id
    FROM users
    WHERE email_address IS NOT NULL
    PRIMARY KEY ((email_address), id);