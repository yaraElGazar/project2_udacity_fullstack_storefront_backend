import { Request, Response, NextFunction } from 'express';
import config from './config';
import JWT, { Secret } from 'jsonwebtoken';

export default function validatingToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.get('Authorization');
    if (header) {
      const splittedHeader = header.split(' ');
      const bearer = splittedHeader[0].toLocaleLowerCase();
      const token = splittedHeader[1];

      if (token && bearer === 'bearer') {
        try {
          const verifyToken = JWT.verify(
            token,
            config.TOKEN_SECRET as unknown as Secret
          );
          if (verifyToken) {
            next();
          }
        } catch (error) {
          res.json(`Valid Token is required. Error: ${error}`);
          return;
        }
      } else {
        res.json(`Error: Token is not of type Bearer.`);
      }
    } else {
      res.json(`Error: Authorization header is required.`);
    }
  } catch (err) {
    res.json(`Valid Token is required. Error: ${err}`);
  }
}
