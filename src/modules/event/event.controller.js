const eventService = require('./event.service');
const { successResponse } = require('../../utils/response');

class EventController {
  async getAll(req, res, next) {
    try {
      const events = await eventService.getAll();
      return successResponse(res, 200, 'Data event berhasil diambil', events);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const event = await eventService.getById(id);
      return successResponse(res, 200, 'Data event berhasil diambil', event);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const event = await eventService.create(req.body);
      return successResponse(res, 201, 'Event berhasil dibuat', event);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const event = await eventService.update(id, req.body);
      return successResponse(res, 200, 'Event berhasil diupdate', event);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await eventService.delete(id);
      return successResponse(res, 200, 'Event berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();