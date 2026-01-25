const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
