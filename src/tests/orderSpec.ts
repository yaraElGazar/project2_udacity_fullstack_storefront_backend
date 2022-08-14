import { order, orderStore } from '../models/order.model';
import { user, userStore } from '../models/user.model';
import { product, productStore } from '../models/product.model';

import database from '../database';

const store = new orderStore();
const store_user = new userStore();
const store_product = new productStore();

describe('Order Model', () => {
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
    expect(store.addingProduct).toBeDefined();
  });
});

describe('Order Model functionality', () => {
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
    const firstUser = await store_user.create(user_test);
    user_test.id = firstUser.id;
    const secondUser = await store_user.create(user_test2);
    user_test2.id = secondUser.id;

    const firstOrder = await store.create(
      user_test.id.toString(),
      order_test.status_of_order
    );
    order_test.id = firstOrder.id;
    order_test.user_id = user_test.id;

    const firstProduct = await store_product.create(product_test);
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

  it('Create method should create new order', async () => {
    const secondInfo = { userId: user_test2.id, status_of_order: 'active' };
    const secondOrder = await store.create(
      secondInfo.userId.toString(),
      secondInfo.status_of_order
    );

    expect(secondOrder).toEqual({
      id: secondOrder.id,
      status_of_order: 'active',
      user_id: user_test2.id,
    } as order);
  });

  it('Index method should return all Completed orders of one user', async () => {
    const orders = await store.index(order_test.user_id.toString());
    expect(orders.length).toEqual(1);
  });

  it('Show method should return Current order of one user', async () => {
    const currentOrder = await store.show(order_test.user_id.toString());
    expect(currentOrder.id).toBe(order_test.id);
    expect(currentOrder.status_of_order).toBe(order_test.status_of_order);
    expect(currentOrder.user_id).toBe(order_test.user_id);
  });
  it('AddingProduct method should add products to existing order', async () => {
    const products = {
      quantity: 10,
      orderId: order_test.id.toString(),
      productId: product_test.id,
    };
    const addedProducts = await store.addingProduct(
      products.quantity,
      products.orderId,
      products.productId
    );
    expect(addedProducts.product_quantity).toBe(products.quantity);
    expect(addedProducts.order_id.toString()).toBe(products.orderId);
    expect(addedProducts.product_id).toBe(products.productId);
  });
});
