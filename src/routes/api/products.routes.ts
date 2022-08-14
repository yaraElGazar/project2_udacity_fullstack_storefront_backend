import express from 'express';
import * as productsHandler from '../../handlers/products.handler';
import tokenValidation from '../../authenticate.function';

const routes = express.Router();

routes.post('/', tokenValidation, productsHandler.create);
routes.get('/', productsHandler.index);
routes.get('/:productId', productsHandler.show);
routes.get('/category/:productCategory', productsHandler.category);

export default routes;
