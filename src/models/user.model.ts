import database from '../database';
import bcrypt from 'bcrypt';
import config from '../config';

const PEPPER = config.PEPPER;
const SALT_ROUNDS = config.SALT_ROUNDS;

const saltRounds: number = +(SALT_ROUNDS as unknown as number);

export class user {
  id!: number;
  email!: string;
  first_name!: string;
  last_name!: string;
  password!: string;
}

export class userStore {
  //Create method (Create new user)
  async create(u: user): Promise<user> {
    try {
      const connection = await database.connect();
      const sql =
        'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) returning id, first_name, last_name, email;';
      const salt = bcrypt.genSaltSync(saltRounds);

      const hashed_password = bcrypt.hashSync(u.password + PEPPER, salt);
      const result = await connection.query(sql, [
        u.first_name,
        u.last_name,
        u.email,
        hashed_password,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not sign up for new user. Error: ${error}`);
    }
  }

  //Read(all) method (Index) [token required]
  async index(): Promise<user[]> {
    try {
      const connection = await database.connect();
      const sql = 'SELECT id, first_name, last_name, email FROM users;';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get users. Error: ${error}`);
    }
  }

  //Read(one) method (Show) [token required]
  async show(userId: string): Promise<user> {
    try {
      const connection = await database.connect();
      const sql =
        'SELECT id, first_name, last_name, email FROM users WHERE id = $1;';
      const result = await connection.query(sql, [userId]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot get user ${userId}. Error: ${error}`);
    }
  }

  //Authentication to give token if user exists in the database
  async authenticate(email: string, password: string): Promise<user | null> {
    try {
      const connection = await database.connect();
      const sql = `SELECT password FROM users WHERE email = $1;`;
      const result = await connection.query(sql, [email]);

      if (result.rows.length > 0) {
        const { password: hashpassword } = result.rows[0];
        const passwordValid = bcrypt.compareSync(
          password + PEPPER,
          hashpassword
        );
        if (passwordValid) {
          const authenticatedUser = await connection.query(
            'SELECT id, email, first_name, last_name FROM users WHERE email=($1);',
            [email]
          );
          return authenticatedUser.rows[0];
        }
      }
      connection.release();
      return null;
    } catch (error) {
      throw new Error(
        `Cannot login to user with email: ${email}. Error: ${error}`
      );
    }
  }
}
