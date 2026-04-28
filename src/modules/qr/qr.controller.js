const qrService = require('./qr.service');
const { successResponse } = require('../../utils/response');

class QRController {
  async generateQR(req, res, next) {
    try {
      const { sekretarisId } = req.user;

      if (!sekretarisId) {
        return res.status(403).json({
          success: false,
          message: 'Hanya sekretaris yang bisa generate QR Code',
        });
      }

      const qrData = await qrService.generateQRToken(sekretarisId);
      return successResponse(res, 200, 'QR Code berhasil di-generate', qrData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QRController();