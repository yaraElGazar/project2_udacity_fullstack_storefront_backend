import database from '../database';

export class product {
  id!: number;
  name!: string;
  category!: string;
  price!: number;
}

export class productStore {
  //Create method (Create new product) [token required]
  async create(p: product): Promise<product> {
    try {
      const connection = await database.connect();
      const sql =
        'INSERT INTO products (name, category, price) VALUES ($1, $2, $3) returning *;';
      const result = await connection.query(sql, [p.name, p.category, p.price]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not create new product. Error: ${error}`);
    }
  }

  //Read(all) method (Index)
  async index(): Promise<product[]> {
    try {
      const connection = await database.connect();
      const sql = 'SELECT * FROM products;';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get products. Error: ${error}`);
    }
  }

  //Read(one) method (Show)
  async show(productId: string): Promise<product> {
    try {
      const connection = await database.connect();
      const sql = 'SELECT * FROM products WHERE id = $1';
      const result = await connection.query(sql, [productId]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot get product ${productId}. Error: ${error}`);
    }
  }

  //Read(all) method (Index) of one category
  async category(category: string): Promise<product[]> {
    try {
      const connection = await database.connect();
      const sql = 'SELECT * FROM products WHERE category = $1;';
      const result = await connection.query(sql, [category]);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Cannot get products with category: ${category}. Error: ${error}`
      );
    }
  }
}
