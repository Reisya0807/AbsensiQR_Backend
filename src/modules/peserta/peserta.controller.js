const pesertaService = require('./peserta.service');
const { successResponse } = require('../../utils/response');

class PesertaController {
  async getAll(req, res, next) {
    try {
      const result = await pesertaService.getAll(req.query);
      return successResponse(res, 200, 'Data peserta berhasil diambil', result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { userId } = req.params;
      const user = await pesertaService.getById(userId);
      return successResponse(res, 200, 'Data peserta berhasil diambil', user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PesertaController();