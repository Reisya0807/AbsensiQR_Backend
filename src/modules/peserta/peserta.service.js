const prisma = require('../../config/database');

class PesertaService {
    async getAll(filters = {}) {
        const { search, role, page = 1, limit = 50 } = filters;

        const where = {};

        if (role) {
            where.role = role;
        } else {
            where.role = 'PESERTA';
        }

        // Search by username, nama, npm, email
        if (search) {
            where.OR = [
                { username: { contains: search, mode: 'insensitive' } },
                {
                    peserta: {
                        OR: [
                            { nama: { contains: search, mode: 'insensitive' } },
                            { npm: { contains: search } },
                            { email: { contains: search, mode: 'insensitive' } },
                        ],
                    },
                },
            ];
        }

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    username: true,
                    role: true,
                    createdAt: true,
                    peserta: {
                        select: {
                            id: true,
                            npm: true,
                            nama: true,
                            email: true,
                            portofolio: true,
                            firstLogin: true,
                            _count: {
                                select: { attendances: true },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: parseInt(limit),
            }),
            prisma.user.count({ where }),
        ]);

        const transformedData = users.map((user) => ({
            userId: user.id,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt,
            peserta: user.peserta || null,
            totalAbsensi: user.peserta?._count?.attendances || 0,
        }));

        return {
            data: transformedData,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getById(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                peserta: {
                    include: {
                        attendances: {
                            orderBy: {
                                timestamp: 'desc',
                            },
                            take: 50,
                        },
                        _count: {
                            select: { attendances: true },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new Error('User tidak ditemukan');
        }

        return {
            userId: user.id,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            peserta: user.peserta
                ? {
                    id: user.peserta.id,
                    npm: user.peserta.npm,
                    nama: user.peserta.nama,
                    email: user.peserta.email,
                    portofolio: user.peserta.portofolio,
                    firstLogin: user.peserta.firstLogin,
                    totalAbsensi: user.peserta._count.attendances,
                    recentAttendances: user.peserta.attendances,
                }
                : null,
        };
    }
}

module.exports = new PesertaService();