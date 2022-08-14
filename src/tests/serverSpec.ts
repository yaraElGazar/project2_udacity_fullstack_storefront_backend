import supertest from 'supertest';
import app from '../server';
import database from '../database';
import { user, userStore } from '../models/user.model';
import { product, productStore } from '../models/product.model';
import { order, orderStore } from '../models/order.model';

const request = supertest(app);
const user_Store = new userStore();
const product_Store = new productStore();
const order_Store = new orderStore();
let token = '';

describe('Test basic endpoints', () => {
  it('gets the basic path endpoint: /', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });
  it('gets the endpoint: /api', async () => {
    const response = await request.get('/api');
    expect(response.status).toBe(200);
  });
});

describe('Test users endpoints', () => {
  const user_test = {
    first_name: 'Yara',
    last_name: 'Gamal',
    email: 'yara@something.com',
    password: 'top_secret1234',
  } as user;

  // Creating user
  beforeAll(async () => {
    const firstUser = await user_Store.create(user_test);
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

  it('get token from: /api/users/authenticate', async () => {
    const response = await request
      .post('/api/users/authenticate')
      .set('Content-type', 'application/json')
      .send({
        email: 'yara@something.com',
        password: 'top_secret1234',
      });
    expect(response.status).toBe(200);
    expect(response.body.user_info.user.id).toBe(user_test.id);
    expect(response.body.user_info.user.email).toBe(user_test.email);
    token = response.body.token.token;
  });

  it('post user to database: /api/users', async () => {
    const user_test2 = {
      first_name: 'Rola',
      last_name: 'Ahmed',
      email: 'rola@something.com',
      password: 'top_secret1234',
    } as user;
    const response = await request
      .post('/api/users')
      .set('Content-type', 'application/json')
      .send(user_test2);
    expect(response.status).toBe(200);
    expect(response.body.user_info.first_name).toBe(user_test2.first_name);
    expect(response.body.user_info.last_name).toBe(user_test2.last_name);
    expect(response.body.user_info.email).toBe(user_test2.email);
  });

  it('gets the endpoint: /api/users', async () => {
    const response = await request
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it(`gets the endpoint: /api/users/1`, async () => {
    const response = await request
      .get(`/api/users/1`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.first_name).toBe(user_test.first_name);
    expect(response.body.last_name).toBe(user_test.last_name);
    expect(response.body.email).toBe(user_test.email);
  });
});

describe('Test products endpoints', () => {
  const product_test = {
    name: "Harry Potter: Philosopher's Stone",
    category: 'books',
    price: 20,
  } as product;

  // Creating product
  beforeAll(async () => {
    const firstProduct = await product_Store.create(product_test);
    product_test.id = firstProduct.id;
  });

  // Deleting products after finish testing
  afterAll(async () => {
    const connection = await database.connect();
    const sql =
      'DELETE FROM products; \nALTER SEQUENCE products_id_seq RESTART WITH 1;';
    await connection.query(sql);
    connection.release();
  });

  it('post product to database: /api/products', async () => {
    const secondProduct = {
      name: 'Lip gloss',
      category: 'makeup',
      price: 25,
    } as product;
    const response = await request
      .post('/api/products')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(secondProduct);
    expect(response.status).toBe(200);
    expect(response.body.product_info.name).toBe(secondProduct.name);
    expect(response.body.product_info.category).toBe(secondProduct.category);
    expect(response.body.product_info.price).toBe(secondProduct.price);
  });

  it('gets the endpoint: /api/products', async () => {
    const response = await request
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it(`gets the endpoint: /api/products/1`, async () => {
    const response = await request
      .get(`/api/products/1`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(product_test.name);
    expect(response.body.category).toBe(product_test.category);
    expect(response.body.price).toBe(product_test.price);
  });

  it(`gets the endpoint: /api/products/category/books`, async () => {
    const response = await request
      .get(`/api/products/category/books`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });
});

describe('Test orders endpoints', () => {
  const order_test = {
    status_of_order: 'complete',
  } as order;

  const user_test = {
    first_name: 'Lara',
    last_name: 'Mohammed',
    email: 'lara@something.com',
    password: 'top_secret1234',
  } as user;

  const user_test2 = {
    first_name: 'Tara',
    last_name: 'Kamel',
    email: 'tara2@something.com',
    password: 'top_secret1234',
  } as user;

  const product_test = {
    name: 'Hunger Games VI',
    category: 'books',
    price: 40,
  } as product;

  // Creating order, users and products
  beforeAll(async () => {
    const firstUser = await user_Store.create(user_test);
    user_test.id = firstUser.id;
    const secondUser = await user_Store.create(user_test2);
    user_test2.id = secondUser.id;

    const firstOrder = await order_Store.create(
      user_test.id.toString(),
      order_test.status_of_order
    );
    order_test.id = firstOrder.id;
    order_test.user_id = user_test.id;

    const firstProduct = await product_Store.create(product_test);
    product_test.id = firstProduct.id;
  });

  // Deleting orders after finish testing
  afterAll(async () => {
    const connection = await database.connect();
    const sql =
      '\nDELETE FROM order_products; \nALTER SEQUENCE order_products_id_seq RESTART WITH 1; DELETE FROM orders; \nALTER SEQUENCE orders_id_seq RESTART WITH 1; \nDELETE FROM users; \nALTER SEQUENCE users_id_seq RESTART WITH 1; \nDELETE FROM products; \nALTER SEQUENCE products_id_seq RESTART WITH 1;';
    await connection.query(sql);
    connection.release();
  });

  it(`post order to database: /api/orders/2`, async () => {
    const secondOrder = { status_of_order: 'active' };
    const response = await request
      .post(`/api/orders/2`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(secondOrder);
    expect(response.status).toBe(200);
    expect(response.body.order_info.user_id).toBe(user_test2.id);
    expect(response.body.order_info.status_of_order).toBe(
      secondOrder.status_of_order
    );
  });

  it(`gets the endpoint: /api/orders/1/complete`, async () => {
    const response = await request
      .get(`/api/orders/1/complete`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it(`gets the endpoint: /api/orders/1`, async () => {
    const response = await request
      .get(`/api/orders/1`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(order_test.id);
    expect(response.body.status_of_order).toBe(order_test.status_of_order);
    expect(response.body.user_id).toBe(order_test.user_id);
  });

  it(`adding products to order: /api/orders/1/products`, async () => {
    const products = {
      quantity: 10,
      orderId: order_test.id,
      productId: product_test.id,
    };
    const response = await request
      .post(`/api/orders/1/products`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(products);
    expect(response.status).toBe(200);
    expect(response.body.product_quantity).toBe(products.quantity);
    expect(response.body.order_id).toBe(products.orderId);
    expect(response.body.product_id).toBe(products.productId);
  });
});
