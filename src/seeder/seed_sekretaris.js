const { PrismaClient, Role } = require('@prisma/client');
const { hashPassword } = require('../utils/bcrypt');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function generateRandomPassword(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

const dataSekretaris = [
  { 
    "nama": "ADMIN SEKRETARIS 1", 
    "npm": "210000001",
    "username": "sekretaris1"
  },
  { 
    "nama": "ADMIN SEKRETARIS 2", 
    "npm": "210000002",
    "username": "sekretaris2"
  }
];

async function main() {
  try {    
    const csvData = [];
    csvData.push(['NPM', 'NAMA', 'USERNAME', 'PASSWORD', 'ROLE']);
    
    let successCount = 0;
    let errorCount = 0;

    for (const item of dataSekretaris) {
      try {
        const randomPassword = generateRandomPassword(5);
        const hashedPassword = await hashPassword(randomPassword);
        
        const namaUppercase = item.nama.toUpperCase();
        
        const user = await prisma.user.upsert({
          where: {
            username: item.username, 
          },
          update: {
            password: hashedPassword,
            role: Role.SEKRETARIS,
          },
          create: {
            username: item.username, 
            password: hashedPassword,
            role: Role.SEKRETARIS,
            sekretaris: {
              create: {
                npm: item.npm,
                nama: namaUppercase,
              },
            },
          },
          include: {
            sekretaris: true,
          },
        });

        csvData.push([
          item.npm,
          namaUppercase,
          item.username,
          randomPassword,
          'SEKRETARIS'
        ]);

        successCount++;
        
      } catch (error) {
        errorCount++;
        console.error(`Error: ${item.nama} (${item.username}) - ${error.message}`);
      }
    }

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const csvFilePath = path.join(__dirname, 'credentials-sekretaris.csv');
    fs.writeFileSync(csvFilePath, csvContent, 'utf-8');

    console.log(`Berhasil: ${successCount} sekretaris`);
    console.log(`Gagal: ${errorCount} sekretaris`);
    console.log(`Total: ${dataSekretaris.length} sekretaris`);
    console.log(`File CSV: credentials-sekretaris.csv`);

  } catch (error) {
    console.error('Error seeding:', error);
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