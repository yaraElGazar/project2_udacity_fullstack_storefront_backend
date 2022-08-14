import { user, userStore } from '../models/user.model';
import database from '../database';

const store = new userStore();

describe('User Model', () => {
  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });
  it('should have a index method', () => {
    expect(store.index).toBeDefined();
  });
  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });
  it('should have an authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });
});

describe('User Model functionality', () => {
  const user_test = {
    first_name: 'Yara',
    last_name: 'Gamal',
    email: 'yara@something.com',
    password: 'top_secret1234',
  } as user;

  // Creating user
  beforeAll(async () => {
    const firstUser = await store.create(user_test);
    user_test.id = firstUser.id;
  });

  // Deleting users after finish testing
  afterAll(async () => {
    const connection = await database.connect();
    const sql =
      'DELETE FROM users; \nALTER SEQUENCE users_id_seq RESTART WITH 1;';
    await connection.query(sql);
    connection.release();
  });

  it('Create method should create new user', async () => {
    const secondUser = await store.create({
      first_name: 'Sara',
      last_name: 'Omar',
      email: 'sara@something.com',
      password: 'top_secret1234',
    } as user);

    expect(secondUser).toEqual({
      id: secondUser.id,
      first_name: 'Sara',
      last_name: 'Omar',
      email: 'sara@something.com',
    } as user);
  });
  it('Authenticate method should return a user if information is correct', async () => {
    const verifiedUser = await store.authenticate(
      user_test.email,
      user_test.password
    );
    expect(verifiedUser?.email).toBe(user_test.email);
    expect(verifiedUser?.first_name).toBe(user_test.first_name);
    expect(verifiedUser?.last_name).toBe(user_test.last_name);
  });
  it('Authenticate method should return null if information is not correct', async () => {
    const unverifiedUser = await store.authenticate(
      'fake@something.com',
      'fakepassword'
    );
    expect(unverifiedUser).toBe(null);
  });

  it('Index method should return all users', async () => {
    const users = await store.index();
    expect(users.length).toEqual(2);
  });

  it('Show method should return specific user', async () => {
    const specificUser = await store.show(user_test.id.toString());
    expect(specificUser.id).toBe(user_test.id);
    expect(specificUser.first_name).toBe(user_test.first_name);
    expect(specificUser.last_name).toBe(user_test.last_name);
    expect(specificUser.email).toBe(user_test.email);
  });
});
