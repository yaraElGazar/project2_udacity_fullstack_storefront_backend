CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status_of_order VARCHAR(50),
    user_id integer NOT NULL REFERENCES users(id)
     );
