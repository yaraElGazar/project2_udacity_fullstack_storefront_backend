import express from 'express';
import * as usersHandler from '../../handlers/users.handler';
import tokenValidation from '../../authenticate.function';

const routes = express.Router();

routes.post('/', usersHandler.create);
routes.get('/', tokenValidation, usersHandler.index);
routes.get('/:userId', tokenValidation, usersHandler.show);

routes.post('/authenticate', usersHandler.authenticate);

export default routes;
