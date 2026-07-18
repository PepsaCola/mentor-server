import HttpError from '../helpers/HttpError.js';

const notFound = (req, res, next) => {
  next(HttpError(404, 'Route not found'));
};

export default notFound;
