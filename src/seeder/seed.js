const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/utils/bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPasswordAdmin = await hashPassword('admin123');
    
    const sekretaris = await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPasswordAdmin,
        role: 'SEKRETARIS',
        sekretaris: {
          create: {
            nama: 'Admin Sekretaris',
            nip: '198501012010011001',
          },
        },
      },
      include: {
        sekretaris: true,
      },
    });

    const hashedPasswordPeserta = await hashPassword('peserta123');
    
    const peserta = await prisma.user.create({
      data: {
        username: 'johndoe',
        password: hashedPasswordPeserta,
        role: 'PESERTA',
        peserta: {
          create: {
            npm: '2106123456',
            nama: 'John Doe',
            email: 'john.doe@example.com',
            portofolio: null,
            firstLogin: true,
          },
        },
      },
      include: {
        peserta: true,
      },
    });

    console.log('✅ Peserta created:', {
      username: peserta.username,
      role: peserta.role,
      npm: peserta.peserta.npm,
      nama: peserta.peserta.nama,
    });

    console.log('Seeding completed successfully!');
    console.log('Default Users:');
    console.log('-----------------------------------');
    console.log('SEKRETARIS:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('-----------------------------------');
    console.log('PESERTA:');
    console.log('  Username: johndoe');
    console.log('  Password: peserta123');
    console.log('  NPM: 2106123456');
    console.log('-----------------------------------');
  } catch (error) {
    console.error('Error seeding database:', error);
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