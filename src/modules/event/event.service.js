const prisma = require('../../config/database');

class EventService {
  async getAll() {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { certificates: true },
        },
      },
    });

    return events;
  }

  async getById(id) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: { certificates: true },
        },
      },
    });

    if (!event) {
      throw new Error('Event tidak ditemukan');
    }

    return event;
  }

  async create(data) {
    const event = await prisma.event.create({
      data: {
        nama: data.nama,
      },
    });

    return event;
  }

  async update(id, data) {
    const event = await prisma.event.update({
      where: { id },
      data: {
        nama: data.nama,
      },
    });

    return event;
  }

  async delete(id) {
    await prisma.event.delete({
      where: { id },
    });
  }
}

module.exports = new EventService();