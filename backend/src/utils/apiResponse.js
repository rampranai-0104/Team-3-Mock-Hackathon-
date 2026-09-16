/**
 * Standardized API Response Helper
 */
const sendSuccess = (res, message, data = null, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

const sendError = (res, message, statusCode = 500, errors = null) => {
    const response = {
        success: false,
        message
    };
    if (errors) {
        response.errors = errors;
    }
    return res.status(statusCode).json(response);
};

module.exports = {
    sendSuccess,
    sendError
};
