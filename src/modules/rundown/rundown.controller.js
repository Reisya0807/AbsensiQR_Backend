const rundownService = require('./rundown.service');
const { successResponse } = require('../../utils/response');

class RundownController {
    async create(req, res, next) {
        try {
            const rundown = await rundownService.create(req.body);
            return successResponse(res, 201, 'Rundown berhasil dibuat', rundown);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const rundowns = await rundownService.getAll();
            return successResponse(res, 200, 'Data rundown berhasil diambil', rundowns);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const rundown = await rundownService.getById(id);
            return successResponse(res, 200, 'Data rundown berhasil diambil', rundown);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const rundown = await rundownService.update(id, req.body);
            return successResponse(res, 200, 'Rundown berhasil diupdate', rundown);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await rundownService.delete(id);
            return successResponse(res, 200, 'Rundown berhasil dihapus');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RundownController();