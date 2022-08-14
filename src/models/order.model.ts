import database from '../database';

export class order {
  id!: number;
  status_of_order!: string;
  user_id!: number;
}

export class order_products {
  id!: number;
  product_quantity!: number;
  order_id!: number;
  product_id!: number;
}

export class orderStore {
  //Create method (Create new order) [token required]
  async create(userId: string, status_of_order: string): Promise<order> {
    try {
      const connection = await database.connect();
      const sql =
        'INSERT INTO orders (status_of_order, user_id) VALUES ($1, $2) returning *;';
      const result = await connection.query(sql, [status_of_order, userId]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not add new order. Error: ${error}`);
    }
  }

  //Read(all) method (Index) [token required] Completed orders
  async index(userId: string): Promise<order[]> {
    try {
      const connection = await database.connect();
      const sql = `SELECT * FROM orders WHERE user_id = $1 AND status_of_order = 'complete';`;
      const result = await connection.query(sql, [userId]);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get users. Error: ${error}`);
    }
  }

  //Read(one) method (Show) [token required] Current order
  async show(userId: string): Promise<order> {
    try {
      const connection = await database.connect();
      const sql = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC';
      const result = await connection.query(sql, [userId]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Cannot get current order of user ${userId}. Error: ${error}`
      );
    }
  }

  //Adding products to existing order
  async addingProduct(
    quantity: number,
    orderId: string,
    productId: number
  ): Promise<order_products> {
    try {
      const connection = await database.connect();
      const sql =
        'INSERT INTO order_products (product_quantity, order_id, product_id) VALUES($1, $2, $3) returning *;';
      const result = await connection.query(sql, [
        quantity,
        orderId,
        productId,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Cannot add product ${productId} to order ${orderId}. Error: ${error}`
      );
    }
  }
}
