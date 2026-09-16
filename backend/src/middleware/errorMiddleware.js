const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error('Error Stack:', err.stack || err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        return res.status(404).json({ success: false, message });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0];
        const message = `Duplicate value entered for ${field ? field : 'unique'} field`;
        return res.status(400).json({ success: false, message });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        return res.status(400).json({ success: false, message });
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;
