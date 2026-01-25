const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, message = 'Error', statusCode = 500, error = null) => {
  const responseObj = {
    success: false,
    message,
  };

  if (error) {
    responseObj.error = error.message || error;
  }

  return res.status(statusCode).json(responseObj);
};

module.exports = { successResponse, errorResponse };
