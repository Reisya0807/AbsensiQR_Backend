const portfolioService = require('./portfolio.service');
const { successResponse, errorResponse } = require('../../utils/response');

class PortfolioController {
  async getMyPortfolios(req, res, next) {
    try {
      if (req.user.role !== 'PESERTA') {
        return errorResponse(res, 403, 'Hanya peserta yang memiliki portfolio');
      }

      const portfolios = await portfolioService.getByPeserta(req.user.pesertaId);
      return successResponse(res, 200, 'Data portfolio berhasil diambil', portfolios);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      if (req.user.role !== 'PESERTA') {
        return errorResponse(res, 403, 'Hanya peserta yang memiliki portfolio');
      }

      const { id } = req.params;
      const portfolio = await portfolioService.getById(id, req.user.pesertaId);
      return successResponse(res, 200, 'Data portfolio berhasil diambil', portfolio);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      if (req.user.role !== 'PESERTA') {
        return errorResponse(res, 403, 'Hanya peserta yang bisa membuat portfolio');
      }

      const portfolio = await portfolioService.create(req.user.pesertaId, req.body);
      return successResponse(res, 201, 'Portfolio berhasil dibuat', portfolio);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      if (req.user.role !== 'PESERTA') {
        return errorResponse(res, 403, 'Hanya peserta yang bisa update portfolio');
      }

      const { id } = req.params;
      const portfolio = await portfolioService.update(id, req.user.pesertaId, req.body);
      return successResponse(res, 200, 'Portfolio berhasil diupdate', portfolio);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      if (req.user.role !== 'PESERTA') {
        return errorResponse(res, 403, 'Hanya peserta yang bisa delete portfolio');
      }

      const { id } = req.params;
      await portfolioService.delete(id, req.user.pesertaId);
      return successResponse(res, 200, 'Portfolio berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PortfolioController();