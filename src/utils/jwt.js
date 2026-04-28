const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

function generateToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    throw new Error('Token tidak valid atau sudah kadaluarsa');
  }
}

module.exports = {
  generateToken,
  verifyToken,
};