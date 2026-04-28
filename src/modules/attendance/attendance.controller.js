const attendanceService = require('./attendance.service');
const { successResponse, errorResponse } = require('../../utils/response');

class AttendanceController {
    async scanQR(req, res, next) {
        try {
            const { pesertaId } = req.user;

            if (!pesertaId) {
                return errorResponse(res, 403, 'Hanya peserta yang bisa scan QR');
            }

            const { token } = req.body;
            const attendance = await attendanceService.scanQR(pesertaId, token);

            return successResponse(res, 201, 'Absensi berhasil', attendance);
        } catch (error) {
            next(error);
        }
    }

    async manualAttendance(req, res, next) {
        try {
            if (req.user.role !== 'SEKRETARIS') {
                return errorResponse(res, 403, 'Hanya sekretaris yang bisa absen manual');
            }

            const { npm } = req.body;
            const attendance = await attendanceService.manualAttendance(npm);

            return successResponse(res, 201, 'Absensi berhasil dicatat', attendance);
        } catch (error) {
            next(error);
        }
    }

    async getAttendance(req, res, next) {
        try {
            const { role, pesertaId } = req.user;

            if (role === 'SEKRETARIS') {
                const result = await attendanceService.getAllAttendance(req.query);
                return successResponse(res, 200, 'Data absensi berhasil diambil', result);
            } else {
                const attendances = await attendanceService.getMyAttendance(pesertaId);
                return successResponse(res, 200, 'Data absensi berhasil diambil', attendances);
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AttendanceController();