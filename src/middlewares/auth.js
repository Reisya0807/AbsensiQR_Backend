const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Token tidak ditemukan');
    }

    const token = authHeader.substring(7);

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    return errorResponse(res, 401, error.message);
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Unauthorized');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses ke resource ini');
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};