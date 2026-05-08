const prisma = require('../../config/database');

class CertificateService {
  async getByPeserta(pesertaId) {
    const certificates = await prisma.certificate.findMany({
      where: { pesertaId },
      include: {
        event: true,
      },
      orderBy: { issuedAt: 'desc' },
    });

    return certificates;
  }

  async getAll(filters = {}) {
    const { search, certificateType, eventId, page = 1, limit = 50 } = filters;

    const where = {};

    if (certificateType) {
      where.certificateType = certificateType;
    }

    if (eventId) {
      where.eventId = eventId;
    }

    if (search) {
      where.OR = [
        { certificateNumber: { contains: search, mode: 'insensitive' } },
        {
          peserta: {
            OR: [
              { nama: { contains: search, mode: 'insensitive' } },
              { npm: { contains: search } },
            ],
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        include: {
          event: true,
          peserta: {
            select: {
              id: true,
              npm: true,
              nama: true,
              email: true,
            },
          },
        },
        orderBy: { issuedAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.certificate.count({ where }),
    ]);

    return {
      data: certificates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id) {
    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        event: true,
        peserta: {
          select: {
            id: true,
            npm: true,
            nama: true,
            email: true,
          },
        },
      },
    });

    if (!certificate) {
      throw new Error('Sertifikat tidak ditemukan');
    }

    return certificate;
  }

  async create(data) {
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event) {
      throw new Error('Event tidak ditemukan');
    }

    const peserta = await prisma.peserta.findUnique({
      where: { id: data.pesertaId },
    });

    if (!peserta) {
      throw new Error('Peserta tidak ditemukan');
    }

    const certificate = await prisma.certificate.create({
      data: {
        certificateNumber: data.certificateNumber,
        certificateType: data.certificateType,
        softFile: data.softFile,
        issuedAt: new Date(data.issuedAt),
        eventId: data.eventId,
        pesertaId: data.pesertaId,
      },
      include: {
        event: true,
        peserta: {
          select: {
            id: true,
            npm: true,
            nama: true,
            email: true,
          },
        },
      },
    });

    return certificate;
  }

  async update(id, data) {
    await this.getById(id);

    if (data.eventId) {
      const event = await prisma.event.findUnique({
        where: { id: data.eventId },
      });

      if (!event) {
        throw new Error('Event tidak ditemukan');
      }
    }

    const updateData = {};
    if (data.certificateNumber !== undefined) updateData.certificateNumber = data.certificateNumber;
    if (data.certificateType !== undefined) updateData.certificateType = data.certificateType;
    if (data.softFile !== undefined) updateData.softFile = data.softFile;
    if (data.issuedAt !== undefined) updateData.issuedAt = new Date(data.issuedAt);
    if (data.eventId !== undefined) updateData.eventId = data.eventId;

    const certificate = await prisma.certificate.update({
      where: { id },
      data: updateData,
      include: {
        event: true,
        peserta: {
          select: {
            id: true,
            npm: true,
            nama: true,
            email: true,
          },
        },
      },
    });

    return certificate;
  }

  async delete(id) {
    await this.getById(id);

    await prisma.certificate.delete({
      where: { id },
    });
  }

  async getByPesertaId(pesertaId) {
    const peserta = await prisma.peserta.findUnique({
      where: { id: pesertaId },
    });

    if (!peserta) {
      throw new Error('Peserta tidak ditemukan');
    }

    const certificates = await prisma.certificate.findMany({
      where: { pesertaId },
      include: {
        event: true,
      },
      orderBy: { issuedAt: 'desc' },
    });

    return certificates;
  }
}

module.exports = new CertificateService();