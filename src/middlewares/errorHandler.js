const { errorResponse } = require('../utils/response');

function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    if (err.code === 'P2002') {
        return errorResponse(res, 409, 'Data sudah ada (duplicate)', {
            field: err.meta?.target,
        });
    }

    if (err.code === 'P2025') {
        return errorResponse(res, 404, 'Data tidak ditemukan');
    }

    if (err.name === 'JsonWebTokenError') {
        return errorResponse(res, 401, 'Token tidak valid');
    }

    if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 401, 'Token sudah kadaluarsa');
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return errorResponse(res, statusCode, message);
}

function notFoundHandler(req, res) {
    return errorResponse(res, 404, `route ${req.originalUrl} tidak ditemukan nub`);
}

module.exports = {
    errorHandler,
    notFoundHandler,
};