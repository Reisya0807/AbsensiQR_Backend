const certificateService = require('./certificate.service');
const { successResponse, errorResponse } = require('../../utils/response');

class CertificateController {
  /**
   * Get my certificates (Peserta)
   */
  async getMyCertificates(req, res, next) {
    try {
      if (req.user.role !== 'PESERTA') {
        return errorResponse(res, 403, 'Hanya peserta yang memiliki sertifikat');
      }

      const certificates = await certificateService.getByPeserta(req.user.pesertaId);
      return successResponse(res, 200, 'Data sertifikat berhasil diambil', certificates);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all certificates (Sekretaris)
   */
  async getAll(req, res, next) {
    try {
      if (req.user.role !== 'SEKRETARIS') {
        return errorResponse(res, 403, 'Hanya sekretaris yang bisa melihat semua sertifikat');
      }

      const result = await certificateService.getAll(req.query);
      return successResponse(res, 200, 'Data sertifikat berhasil diambil', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get certificate by ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const certificate = await certificateService.getById(id);

      // Jika peserta, cek apakah sertifikat miliknya
      if (req.user.role === 'PESERTA' && certificate.pesertaId !== req.user.pesertaId) {
        return errorResponse(res, 403, 'Anda tidak memiliki akses ke sertifikat ini');
      }

      return successResponse(res, 200, 'Data sertifikat berhasil diambil', certificate);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get certificates by peserta ID (Sekretaris)
   */
  async getByPesertaId(req, res, next) {
    try {
      if (req.user.role !== 'SEKRETARIS') {
        return errorResponse(res, 403, 'Hanya sekretaris yang bisa melihat sertifikat peserta');
      }

      const { pesertaId } = req.params;
      const certificates = await certificateService.getByPesertaId(pesertaId);
      return successResponse(res, 200, 'Data sertifikat berhasil diambil', certificates);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create certificate (Sekretaris)
   */
  async create(req, res, next) {
    try {
      if (req.user.role !== 'SEKRETARIS') {
        return errorResponse(res, 403, 'Hanya sekretaris yang bisa membuat sertifikat');
      }

      const certificate = await certificateService.create(req.body);
      return successResponse(res, 201, 'Sertifikat berhasil dibuat', certificate);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update certificate (Sekretaris)
   */
  async update(req, res, next) {
    try {
      if (req.user.role !== 'SEKRETARIS') {
        return errorResponse(res, 403, 'Hanya sekretaris yang bisa update sertifikat');
      }

      const { id } = req.params;
      const certificate = await certificateService.update(id, req.body);
      return successResponse(res, 200, 'Sertifikat berhasil diupdate', certificate);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete certificate (Sekretaris)
   */
  async delete(req, res, next) {
    try {
      if (req.user.role !== 'SEKRETARIS') {
        return errorResponse(res, 403, 'Hanya sekretaris yang bisa delete sertifikat');
      }

      const { id } = req.params;
      await certificateService.delete(id);
      return successResponse(res, 200, 'Sertifikat berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CertificateController();