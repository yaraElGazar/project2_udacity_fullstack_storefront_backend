# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Users

- Create: '/api/users'[POST]<br>
  example: <br>

```
{
    "first_name": "Harry",
    "last_name": "Potter",
    "email": "Harry@hogwarts.com",
    "password": "password1234"
}
```

returns: <br>

```
{
    "message": "User created!",
    "user_info": {
        "id": 7,
        "first_name": "Harry",
        "last_name": "Potter",
        "email": "Harry@hogwarts.com"
    }
}
```

- Authenticate 'api/users/authenticate' [POST]
  example: <br>

```
{
    "email": "Harry@hogwarts.com",
    "password": "password1234"
}
```

returns: <br>

```
{
    "message": "User verified!",
    "user_info": {
        "user": {
            "id": 7,
            "email": "Harry@hogwarts.com",
            "first_name": "Harry",
            "last_name": "Potter"
        }
    },
    "token": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6IkhhcnJ5QGhvZ3dhcnRzLmNvbSIsImZpcnN0X25hbWUiOiJIYXJyeSIsImxhc3RfbmFtZSI6IlBvdHRlciJ9LCJpYXQiOjE2NTUxMzY3NTl9.FdzC6BkZddHGxtUx2K2FxBy9yDC0iP0ati7pDUzyTOM"
    }
}
```

- Index [token required]: '/api/users'[GET]
- Show [token required]: '/api/users/:id'[GET]

#### Products

- Create [token required]: '/api/products'[POST]<br>
  example: <br>

```
{
    "name": "Priciples of Chemical Engineering",
    "category": "books",
    "price": 10
}
```

returns: <br>

```
{
    "message": "Product created!",
    "product_info": {
        "id": 1,
        "name": "Priciples of Chemical Engineering",
        "category": "books",
        "price": 10
    }
}
```

- Index: '/api/products'[GET]
- Show: '/api/products/:id'[GET]

- Products by category (args: product category): '/api/products/category/:categoryName'[GET]

#### Orders

- Creating orders (args: user id)[token required]: '/api/orders/:userid'[POST]
  example: <br>

```
localhost:3000/api/orders/1
{
    "status_of_order": "active"
}
```

returns: <br>

```
{
    "message": "Order created!",
    "order_info": {
        "id": 2,
        "status_of_order": "active",
        "user_id": 1
    }
}


- Current Order by user (args: user id)[token required]: '/api/orders/:userid'[GET]

- Completed Orders by user (args: user id)[token required]: '/api/orders/:userid/complete'[GET]

- Adding products to existing order[token required]: '/api/orders/:orderid/products'[POST]
example: <br>
```

localhost:3000/api/orders/1/products
{
"quantity":20,
"productId":1

}

returns: <br>

```
{
    "id": 2,
    "product_id": 1,
    "product_quantity": 20,
    "order_id": 1
}

```

## Data Shapes

#### Product

- id
- name
- price
- [OPTIONAL] category

#### User

- id
- email
- first_name
- last_name
- password

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## Tables in DataBase

### Table: users

id: serial primary key,<br>
email: varchar(255) UNIQUE<br>
first_name: varchar(255) NOT NULL,<br>
last_name: varchar(255) NOT NULL,<br>
password: varchar(255) NOT NULL<br>

### Table: products

id: serial primary key,<br>
name: varchar(255) NOT NULL,<br>
category: varchar(255),<br>
price: integer NOT NULL)<br>

### Table: orders

id: serial primary key,<br>status_of_orde:r VARCHAR(50),<br>
user_id: integer NOT NULL[foreign key to users table]<br>
status_of_order: VARCHAR(50)

### Table: order_products

id: serial primary key,<br>
product_id: integer NOT NULL [foreign key to products table],<br>
product_quantity: integer NOT NULL,<br>
order_id: integer NOT NULL [foreign key to orders table]<br>
