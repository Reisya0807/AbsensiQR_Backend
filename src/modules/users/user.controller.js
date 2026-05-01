const userService = require('./user.service');
const { successResponse, errorResponse } = require('../../utils/response');

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.userId);
      return successResponse(res, 200, 'Data profile berhasil diambil', user);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const profile = await userService.updateProfile(
        req.user.userId,
        req.user.role,
        req.body
      );
      return successResponse(res, 200, 'Profile berhasil diupdate', profile);
    } catch (error) {
      next(error);
    }
  }

  async updatePortfolio(req, res, next) {
    try {
      if (req.user.role !== 'PESERTA') {
        return errorResponse(res, 403, 'Hanya peserta yang bisa update portfolio');
      }

      const { portofolio } = req.body;
      const peserta = await userService.updatePortfolio(req.user.userId, portofolio);
      return successResponse(res, 200, 'Portfolio berhasil diupdate', peserta);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      await userService.changePassword(req.user.userId, oldPassword, newPassword);
      return successResponse(res, 200, 'Password berhasil diubah');
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      if (req.user.role !== 'SEKRETARIS') {
        return errorResponse(res, 403, 'Hanya sekretaris yang bisa reset password');
      }

      const { userId } = req.body;
      const result = await userService.resetPassword(userId);
      return successResponse(res, 200, 'Password berhasil direset', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();