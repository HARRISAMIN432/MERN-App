const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    
    if(err.name === "castError") {
        err = new ErrorHandler(`Resource not found. Invalid: ${err.path}`, 400);
    }

    if(err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    if(err.name === "JsonWebTokenError") {
        const message = "Json web token is invalid. Try again";
        err = new ErrorHandler(message, 400);
    }

    if(err.name === "TokenExpiredError") {
        const message = "Json web token is expired. Try again";
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}