CREATE DATABASE blogs;

CREATE TABLE users(
    id uuid DEFAULT uuid_generate_v4 (),
    username VARCHAR(125) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(125) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Refresh_Token(
    user_id uuid NOT NULL REFERENCES users(id),
    refresh_token VARCHAR NOT NULL,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 DAY',
    PRIMARY KEY (user_id)
);

CREATE TABLE product(
  id uuid DEFAULT uuid_generate_v4 (),
  name VARCHAR(100) NOT NULL,
  price NUMERIC(7, 2) NOT NULL,
  quantity INT NOT NULL,
  description TEXT,
  image VARCHAR,
  currency VARCHAR(5) DEFAULT 'EUR',
  PRIMARY KEY (id)
);

CREATE TABLE Orders(
    id uuid DEFAULT uuid_generate_v4 (),
    user_id uuid NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    total_price NUMERIC(7,2) NOT NULL DEFAULT 0,
    is_check BOOLEAN NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Ordered_PD(
    pd_id uuid NOT NULL REFERENCES product(id),
    order_id uuid NOT NULL REFERENCES orders(id),
    quantity INT NOT NULL,
    total_price NUMERIC(7,2) NOT NULL,
    PRIMARY KEY(pd_id, order_id)
);

CREATE TABLE Order_consumer(
    order_id uuid NOT NULL REFERENCES orders(id),
    given_name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phonenumber VARCHAR(15)
);

INSERT INTO product(name, price, quantity, image) VALUES('jumping rope', 12.89, 77, 'http://localhost:8000/images/product/jumping_rope.jpg')

INSERT INTO product(name, price, quantity, image) VALUES('dumbbell', 15.45, 88, 'http://localhost:8000/images/product/dumbbell.jpg')

INSERT INTO product(name, price, quantity, image) VALUES('sneaker', 89.99, 100, 'http://localhost:8000/images/product/sneaker.jpg')
