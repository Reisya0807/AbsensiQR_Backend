const prisma = require('../../config/database');

class UserService {
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        peserta: true,
        sekretaris: true,
      },
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    delete user.password;
    return user;
  }

  async updateProfile(userId, role, data) {
    if (role === 'PESERTA') {
      const updatedPeserta = await prisma.peserta.update({
        where: { userId },
        data: {
          nama: data.nama,
          email: data.email,
        },
      });
      return updatedPeserta;
    } else {
      const updatedSekretaris = await prisma.sekretaris.update({
        where: { userId },
        data: {
          nama: data.nama,
          npm: data.npm,
        },
      });
      return updatedSekretaris;
    }
  }

  async updatePortfolio(userId, portofolio) {
    const updatedPeserta = await prisma.peserta.update({
      where: { userId },
      data: {
        portofolio,
        firstLogin: false,
      },
    });

    return updatedPeserta;
  }
}

module.exports = new UserService();