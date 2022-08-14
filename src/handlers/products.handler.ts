import { Request, Response, NextFunction } from 'express';
import { nextTick } from 'process';
import { product, productStore } from '../models/product.model';

const store = new productStore();

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product: product = await store.create(req.body);
    res.json({
      message: 'Product created!',
      product_info: { ...product },
    });
  } catch (err) {
    next(err);
  }
};

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
  const products = await store.index();
  res.json(products);
  } catch (err) {
  next(err);
  };
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await store.show(req.params.productId);
    res.send(product);
  } catch (err) {
    next(err);
  }
};

export const category = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await store.category(req.params.productCategory);
    res.send(products);
  } catch (err) {
    next(err);
  }
};
