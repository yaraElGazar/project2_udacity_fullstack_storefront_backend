CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    category varchar(255),
    price integer NOT NULL);
