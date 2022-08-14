CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    product_id integer NOT NULL REFERENCES products(id),
    product_quantity integer NOT NULL,
    order_id integer NOT NULL REFERENCES orders(id)
     );