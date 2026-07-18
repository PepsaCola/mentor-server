import jwt from 'jsonwebtoken';

import HttpError from '../helpers/HttpError.js';
import prisma from '../lib/prisma.js';

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw HttpError(401, 'Not authorized');
    }

    let payload;
    try {
      payload = jwt.verify(token, SECRET_KEY);
    } catch {
      throw HttpError(401, 'Not authorized');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      throw HttpError(401, 'Not authorized');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default authenticate;
