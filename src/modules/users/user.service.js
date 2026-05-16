const prisma = require('../../config/database');
const { comparePassword, hashPassword } = require('../../utils/bcrypt');
const crypto = require('crypto');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

class UserService {
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { peserta: true, sekretaris: true },
    });

    if (!user) throw createError('User tidak ditemukan', 404);

    delete user.password;
    return user;
  }

  async updateProfile(userId, role, data) {
    if (role === 'PESERTA') {
      return await prisma.peserta.update({
        where: { userId },
        data: { nama: data.nama, email: data.email },
      });
    }

    return await prisma.sekretaris.update({
      where: { userId },
      data: { nama: data.nama, npm: data.npm },
    });
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw createError('User tidak ditemukan', 404);

    const isValid = await comparePassword(oldPassword, user.password);
    if (!isValid) throw createError('Password lama tidak sesuai', 400);
    
    await prisma.user.update({
      where: { id: userId },
      data: { password: await hashPassword(newPassword) },
    });
    if (user.role === 'PESERTA') {
      await prisma.peserta.update({
        where: {userId: userId},
        data: { firstLogin: false}
      })
    }

    return true;
  }

  async resetPassword(targetUserId) {
    const user = await prisma.user.findUnique({ where: { id: targetUserId } });

    if (!user) throw createError('User tidak ditemukan', 404);

    const randomPassword = crypto.randomBytes(4).toString('hex');

    await prisma.user.update({
      where: { id: targetUserId },
      data: { password: await hashPassword(randomPassword) },
    });

    return { username: user.username, newPassword: randomPassword };
  }
}

module.exports = new UserService();