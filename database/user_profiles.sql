

CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR,
    website VARCHAR,
    user_id INT NOT NULL UNIQUE REFERENCES users(id)
);
