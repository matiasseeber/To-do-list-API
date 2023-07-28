CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE UNIQUE NOT NULL,
    password VARCHAR(100),
	verification_code int,
	last_verification_code_sent_at timestamp without time zone,
	last_verification_at timestamp without time zone
);
