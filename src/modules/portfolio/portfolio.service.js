const prisma = require('../../config/database');

class PortfolioService {
  /**
   * Get all portfolios by peserta
   */
  async getByPeserta(pesertaId) {
    const portfolios = await prisma.portfolio.findMany({
      where: { pesertaId },
      orderBy: { createdAt: 'desc' },
    });

    return portfolios;
  }

  /**
   * Get portfolio by ID
   */
  async getById(id, pesertaId) {
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id,
        pesertaId, // Pastikan portfolio milik peserta ini
      },
    });

    if (!portfolio) {
      throw new Error('Portfolio tidak ditemukan');
    }

    return portfolio;
  }

  /**
   * Create portfolio
   */
  async create(pesertaId, data) {
    const portfolio = await prisma.portfolio.create({
      data: {
        title: data.title,
        description: data.description,
        link: data.link || null,
        pesertaId,
      },
    });

    // Update firstLogin jadi false
    await prisma.peserta.update({
      where: { id: pesertaId },
      data: { firstLogin: false },
    });

    return portfolio;
  }

  /**
   * Update portfolio
   */
  async update(id, pesertaId, data) {
    // Cek ownership
    const portfolio = await this.getById(id, pesertaId);

    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.link !== undefined) updateData.link = data.link || null;

    const updated = await prisma.portfolio.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  /**
   * Delete portfolio
   */
  async delete(id, pesertaId) {
    // Cek ownership
    await this.getById(id, pesertaId);

    await prisma.portfolio.delete({
      where: { id },
    });
  }
}

module.exports = new PortfolioService();