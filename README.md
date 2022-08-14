# Storefront Backend

##### This API is build for an online store. It is connected to a database that contains users, products and orders. The API can create users, products and orders. It also can return them all or based on specific criteria.

## Quick Start

#### For packages installation, type in your terminal:

`npm install`

#### For creating database:

1. Connect to Postgres
   `psql -U postgres`
2. Create new user<br>
   `CREATE ROLE shopping_store WITH LOGIN PASSWORD 'shopping12345';`
3. Create dev and test databases<br>
   `CREATE DATABASE store_data;`<br>
   `CREATE DATABASE store_data_test;`
4. Grant all privileges to the new user<br>
   `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO shopping_store;`
5. Add some features to the new user<br>
   `ALTER ROLE shopping_store SUPERUSER CREATEDB CREATEROLE REPLICATION;`

#### For database migration, run the following comand in the root directory:<br>

`npm run migration_up`<br>
_This should generate four tables: (users, products, orders, order_products)_<br>
**For dropping the tables run:**<br>
`npm run migration_down`

#### Environmental Variables:<br>

_Note: The environmental variables are set in the .env file in the root directory, the values set are for my current environment. Please feel free to change it depending on your environment._

ENV=**\*\*\*\***<br>
PORT=**\*\*\*\***<br>
POSTGRES_HOST=**\*\*\*\***<br>
POSTGRES_PORT=**\*\*\*\***<br>
POSTGRES_DB=**\*\*\*\***<br>
POSTGRES_DB_TEST=**\*\*\*\***<br>
POSTGRES_USER=**\*\*\*\***<br>
POSTGRES_PASSWORD=**\*\*\*\***<br>
PEPPER=**\*\*\*\***<br>
SALT_ROUNDS=**\*\*\*\***<br>
TOKEN_SECRET=**\*\*\*\***<br>

## Using the API

##### To start using the API please follow the following steps

1. In the terminal run the following code in the root directory:<br>
   `npm run start`<br>
   _This will generate a folder called 'dist' which contains the compiled JS files and will start running the server on port 3000._<br>
2. Make sure that the server is running on port 3000 and the database on port 5432

## Endpoints

_All the endpoints are mentioned in the REQUIREMENTS.md file_

## Authorization

_The tokens should be passed in the header_<br>
`Authorization Bearer <token>`

## Testing

_For testing please type the following command in the terminal_<br>
`npm run test`

Please be noted that the OS used to develop this project is Windows. If you are using MacOS please change the following script in the packages.json so that the tests will run smoothly.<br>
Windows: ` "test": "set ENV=test&& tsc && db-migrate up --env test && tsc && jasmine && db-migrate down -c 4"`<br>
MacOs: ` "test": "export ENV=test&& tsc && db-migrate up --env test && tsc && jasmine && db-migrate down -c 4"`<br>
