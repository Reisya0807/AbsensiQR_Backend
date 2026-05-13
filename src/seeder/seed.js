const { PrismaClient, Role } = require('@prisma/client');
const { hashPassword } = require('../utils/bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPasswordAdmin = await hashPassword('admin123');
    const hashedPasswordPeserta = await hashPassword('peserta123');

    const sekretaris = await prisma.user.upsert({
      where: {
        username: '21061234567',
      },
      update: {},
      create: {
        username: '21061234567',
        password: hashedPasswordAdmin,
        role: Role.SEKRETARIS,
        sekretaris: {
          create: {
            nama: 'Admin Sekretaris',
            npm: '21061234567',
          },
        },
      },
      include: {
        sekretaris: true,
      },
    });

    const peserta = await prisma.user.upsert({
      where: {
        username: '2106123456',
      },
      update: {},
      create: {
        username: '2106123456',
        password: hashedPasswordPeserta,
        role: Role.PESERTA,
        peserta: {
          create: {
            npm: '2106123456',
            nama: 'John Doe',
            email: 'john.doe@example.com',
            firstLogin: true,
          },
        },
      },
      include: {
        peserta: true,
      },
    });

    console.log('SEKRETARIS');
    console.log('Username : 21061234567');
    console.log('Password : admin123');

    console.log('-----------------------------------');

    console.log('PESERTA');
    console.log('Username : 2106123456');
    console.log('Password : peserta123');
    console.log('NPM      : 2106123456');

  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });