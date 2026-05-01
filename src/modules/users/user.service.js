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

  async changePassword(userId, oldPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    // Verify old password
    const isValidPassword = await comparePassword(oldPassword, user.password);

    if (!isValidPassword) {
      throw new Error('Password lama tidak sesuai');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return true;
  }

  async resetPassword(targetUserId) {
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    const randomPassword = crypto.randomBytes(4).toString('hex');

    const hashedPassword = await hashPassword(randomPassword);

    await prisma.user.update({
      where: { id: targetUserId },
      data: { password: hashedPassword },
    });

    return {
      username: user.username,
      newPassword: randomPassword,
    };
  }
}

module.exports = new UserService();