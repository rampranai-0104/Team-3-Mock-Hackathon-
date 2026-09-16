/**
 * Standard API Response utilities adhering to project documentation conventions
 * Flexible argument ordering to support:
 * - sendError(res, message, errors, statusCode)
 * - sendError(res, message, statusCode, errors)
 */

const sendSuccess = (res, message = 'Request successful', data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, message = 'An error occurred', arg3 = null, arg4 = null) => {
  let statusCode = 400;
  let errors = null;

  if (typeof arg3 === 'number') {
    statusCode = arg3;
    errors = arg4;
  } else {
    errors = arg3;
    if (typeof arg4 === 'number') {
      statusCode = arg4;
    }
  }

  const response = {
    success: false,
    message
  };

  if (errors !== null && errors !== undefined) {
    response.errors = Array.isArray(errors) ? errors : [errors];
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError
};
