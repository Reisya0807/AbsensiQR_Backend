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
            const { id } = req.params;
            const peserta = await pesertaService.getById(id);
            return successResponse(res, 200, 'Data peserta berhasil diambil', peserta);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PesertaController();