import { Request, Response, NextFunction } from 'express';
import { nextTick } from 'process';
import { order, orderStore } from '../models/order.model';

const store = new orderStore();

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order: order = await store.create(
      req.params.userId,
      req.body.status_of_order
    );
    res.json({
      message: 'Order created!',
      order_info: { ...order },
    });
  } catch (err) {
    next(err);
  }
};

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
  const orders = await store.index(req.params.userId);
  res.json(orders);
  } catch(err) {
  next(err)
  }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await store.show(req.params.userId);
    res.send(order);
  } catch (err) {
    next(err);
  }
};

export const addingProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await store.addingProduct(
      req.body.quantity,
      req.params.orderId,
      req.body.productId
    );
    res.send(order);
  } catch (err) {
    next(err);
  }
};
