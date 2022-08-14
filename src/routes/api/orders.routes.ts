import express from 'express';
import * as ordersHandler from '../../handlers/orders.handler';
import tokenValidation from '../../authenticate.function';

const routes = express.Router();

routes.post('/:userId', tokenValidation, ordersHandler.create);
routes.get('/:userId', tokenValidation, ordersHandler.show);
routes.get('/:userId/complete', tokenValidation, ordersHandler.index);
routes.post(
  '/:orderId/products',
  tokenValidation,
  ordersHandler.addingProducts
);

export default routes;
