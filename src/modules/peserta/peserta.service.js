const prisma = require('../../config/database');

class PesertaService {
    async getAll(filters = {}) {
        const { search, page = 1, limit = 50 } = filters;

        const where = {};

        if (search) {
            where.OR = [
                { nama: { contains: search, mode: 'insensitive' } },
                { npm: { contains: search } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        const skip = (page - 1) * limit;

        const [peserta, total] = await Promise.all([
            prisma.peserta.findMany({
                where,
                include: {
                    _count: {
                        select: { attendances: true },
                    },
                },
                orderBy: {
                    nama: 'asc',
                },
                skip,
                take: parseInt(limit),
            }),
            prisma.peserta.count({ where }),
        ]);

        return {
            data: peserta,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getById(id) {
        const peserta = await prisma.peserta.findUnique({
            where: { id },
            include: {
                attendances: {
                    orderBy: {
                        timestamp: 'desc',
                    },
                },
            },
        });

        if (!peserta) {
            throw new Error('Peserta tidak ditemukan');
        }

        return peserta;
    }
}

module.exports = new PesertaService();