import { Pool } from 'pg';
import config from './config';

let database = new Pool();

if (config.ENV === 'dev') {
  database = new Pool({
    host: config.POSTGRES_HOST,
    database: config.POSTGRES_DB,
    user: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
    port: parseInt(config.POSTGRES_PORT as string),
  });
}

if (config.ENV === 'test') {
  database = new Pool({
    host: config.POSTGRES_HOST,
    database: config.POSTGRES_DB_TEST,
    user: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
    port: parseInt(config.POSTGRES_PORT as string),
  });
}

export default database;
