import { product, productStore } from '../models/product.model';
import database from '../database';

const store = new productStore();

describe('Product Model', () => {
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
    expect(store.category).toBeDefined();
  });
});

describe('Product Model functionality', () => {
  const product_test = {
    name: "Harry Potter: Philosopher's Stone",
    category: 'books',
    price: 20,
  } as product;

  // Creating product
  beforeAll(async () => {
    const firstProduct = await store.create(product_test);
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

  it('Create method should create new product', async () => {
    const secondProduct = await store.create({
      name: 'Lip gloss',
      category: 'makeup',
      price: 25,
    } as product);

    expect(secondProduct).toEqual({
      id: secondProduct.id,
      name: 'Lip gloss',
      category: 'makeup',
      price: 25,
    } as product);
  });

  it('Index method should return all products', async () => {
    const products = await store.index();
    expect(products.length).toEqual(2);
  });

  it('Show method should return specific product', async () => {
    const specificProduct = await store.show(product_test.id.toString());
    expect(specificProduct.id).toBe(product_test.id);
    expect(specificProduct.name).toBe(product_test.name);
    expect(specificProduct.category).toBe(product_test.category);
    expect(specificProduct.price).toBe(product_test.price);
  });

  it('Category method should return products with the specified category', async () => {
    const specificCategory = await store.category(product_test.category);
    expect(specificCategory.length).toBe(1);
  });
});
