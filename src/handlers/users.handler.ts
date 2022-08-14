import { Request, Response, NextFunction } from 'express';
import { user, userStore } from '../models/user.model';
import config from '../config';
import JWT, { Secret } from 'jsonwebtoken';

const store = new userStore();

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: user = await store.create(req.body);
    res.json({
      message: 'User created!',
      user_info: { ...user },
    });
  } catch (err) {
    next(err);
  }
};

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
  const users = await store.index();
  res.json(users);
  } catch (err) {
    next(err);
  };
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await store.show(req.params.userId);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const user = await store.authenticate(email, password);
    const token = JWT.sign({ user }, config.TOKEN_SECRET as unknown as Secret);
    if (!user) {
      return res.json({
        message:
          'Error! User can not be verified. Please check your  email and password',
      });
    }
    res.json({
      message: 'User verified!',
      user_info: { user },
      token: { token },
    });
  } catch (err) {
    next(err);
  }
};
