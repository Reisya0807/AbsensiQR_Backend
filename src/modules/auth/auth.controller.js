const authService = require('./auth.service');
const { successResponse, errorResponse } = require('../../utils/response');

class AuthController {
    async register(req, res, next) {
        try {
            const user = await authService.register(req.body);
            return successResponse(res, 201, 'Registrasi berhasil', user);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const result = await authService.login(username, password);
            return successResponse(res, 200, 'Login berhasil', result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();