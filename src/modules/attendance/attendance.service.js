const prisma = require('../../config/database');
const qrService = require('../qr/qr.service');

class AttendanceService {
    async scanQR(pesertaId, token) {
        const qrToken = await qrService.validateQRToken(token);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                pesertaId,
                qrTokenId: qrToken.id,
                timestamp: {
                    gte: today,
                },
            },
        });

        if (existingAttendance) {
            throw new Error('Anda sudah absen dengan QR Code ini');
        }

        const attendance = await prisma.attendance.create({
            data: {
                pesertaId,
                qrTokenId: qrToken.id,
                method: 'QR_SCAN',
                status: 1,
            },
            include: {
                peserta: {
                    select: {
                        npm: true,
                        nama: true,
                    },
                },
            },
        });

        // mark qr (optional, tergantung requirement) (kalau ada perubahan lage)
        // await qrService.markAsUsed(qrToken.id);

        return attendance;
    }

    async manualAttendance(npm) {
        const peserta = await prisma.peserta.findUnique({
            where: { npm },
        });

        if (!peserta) {
            throw new Error('Data peserta tidak ditemukan');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                pesertaId: peserta.id,
                timestamp: {
                    gte: today,
                },
            },
        });

        if (existingAttendance) {
            const updated = await prisma.attendance.update({
                where: { id: existingAttendance.id },
                data: {
                    timestamp: new Date(),
                    method: 'MANUAL',
                },
                include: {
                    peserta: {
                        select: {
                            npm: true,
                            nama: true,
                        },
                    },
                },
            });

            return updated;
        }

        const attendance = await prisma.attendance.create({
            data: {
                pesertaId: peserta.id,
                method: 'MANUAL',
                status: 1,
            },
            include: {
                peserta: {
                    select: {
                        npm: true,
                        nama: true,
                    },
                },
            },
        });

        return attendance;
    }

    async getAllAttendance(filters = {}) {
        const { date, npm, page = 1, limit = 50 } = filters;

        const where = {};

        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            where.timestamp = {
                gte: startDate,
                lte: endDate,
            };
        }

        if (npm) {
            where.peserta = {
                npm: {
                    contains: npm,
                },
            };
        }

        const skip = (page - 1) * limit;

        const [attendances, total] = await Promise.all([
            prisma.attendance.findMany({
                where,
                include: {
                    peserta: {
                        select: {
                            npm: true,
                            nama: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    timestamp: 'desc',
                },
                skip,
                take: parseInt(limit),
            }),
            prisma.attendance.count({ where }),
        ]);

        return {
            data: attendances,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getMyAttendance(pesertaId) {
        const attendances = await prisma.attendance.findMany({
            where: { pesertaId },
            orderBy: {
                timestamp: 'desc',
            },
        });

        return attendances;
    }
}

module.exports = new AttendanceService();