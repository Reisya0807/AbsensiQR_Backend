const prisma = require('../../config/database');

class RundownService {
    async create(data) {
        const rundown = await prisma.rundown.create({
            data: {
                judul: data.judul,
                deskripsi: data.deskripsi,
                waktuMulai: new Date(data.waktuMulai),
                waktuSelesai: new Date(data.waktuSelesai),
                isHighlight: data.isHighlight || false,
            },
        });

        return rundown;
    }

    async getAll() {
        const rundowns = await prisma.rundown.findMany({
            orderBy: {
                waktuMulai: 'asc',
            },
        });

        return rundowns;
    }

    async getById(id) {
        const rundown = await prisma.rundown.findUnique({
            where: { id },
        });

        if (!rundown) {
            throw new Error('Rundown tidak ditemukan');
        }

        return rundown;
    }

    async update(id, data) {
        const updateData = {};

        if (data.judul) updateData.judul = data.judul;
        if (data.deskripsi !== undefined) updateData.deskripsi = data.deskripsi;
        if (data.waktuMulai) updateData.waktuMulai = new Date(data.waktuMulai);
        if (data.waktuSelesai) updateData.waktuSelesai = new Date(data.waktuSelesai);
        if (data.isHighlight !== undefined) updateData.isHighlight = data.isHighlight;

        const rundown = await prisma.rundown.update({
            where: { id },
            data: updateData,
        });

        return rundown;
    }

    async delete(id) {
        await prisma.rundown.delete({
            where: { id },
        });
    }
}

module.exports = new RundownService();