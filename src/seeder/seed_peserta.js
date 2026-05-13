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

const dataPeserta = [
  { "nama": "MOCHAMAD AKMAL GOJALI", "npm": "253040001" },
  { "nama": "HAMDANI FAHMI", "npm": "253040002" },
  { "nama": "SALWA NURIANAH", "npm": "253040003" },
  { "nama": "RICY RIFANI PUTRA", "npm": "253040004" },
  { "nama": "MUHAMMAD RIFQI RAJIF", "npm": "253040005" },
  { "nama": "DHIKA PRADITYA", "npm": "253040006" },
  { "nama": "NOVIEA JUNIA BERLIANA NARAHAYAAN", "npm": "253040007" },
  { "nama": "REGA PUSPA ALFARISANDI", "npm": "253040008" },
  { "nama": "MUHAMMAD ZIAN FAUZAN", "npm": "253040009" },
  { "nama": "NURUL INAYAH RONUR", "npm": "253040010" },
  { "nama": "RAISSA FADHILAH AKBAR", "npm": "253040011" },
  { "nama": "SOKIB RIDHO", "npm": "253040012" },
  { "nama": "Ridho Muhammad Rassya", "npm": "253040013" },
  { "nama": "ADITIYA HERPAVI", "npm": "253040014" },
  { "nama": "AHMAD RIFKY TIANDRA", "npm": "253040015" },
  { "nama": "RAFII MUHAZZID NURRISKY", "npm": "253040016" },
  { "nama": "DEFARRA ZULAFAN ADNA RUSANDO", "npm": "253040017" },
  { "nama": "INDRIANI NURHIDAYAH", "npm": "253040018" },
  { "nama": "ARHAAM KHAIRUL RIZQI", "npm": "253040019" },
  { "nama": "ERVINA RAHMA FADILLA", "npm": "253040020" },
  { "nama": "AZZALEA NISSA RACHMAH", "npm": "253040021" },
  { "nama": "KALLIO MELANDRI ALFATH", "npm": "253040022" },
  { "nama": "DZAQI NATSIRUL HAQ", "npm": "253040023" },
  { "nama": "MUHAMMAD ILMI FASYA AR-RAFI", "npm": "253040024" },
  { "nama": "SATRIO SURYA PRATAMA", "npm": "253040025" },
  { "nama": "REVAN FADHILLAH SONJAYA", "npm": "253040026" },
  { "nama": "Novaldy Arya Friwansyah", "npm": "253040027" },
  { "nama": "MUHAMMAD RAFI AKBAR", "npm": "253040028" },
  { "nama": "MOCHAMAD IQBAL ADITYA ANUGRAH", "npm": "253040029" },
  { "nama": "JOHAN RIFANSAH", "npm": "253040030" },
  { "nama": "MOCH DANDY FAUZI", "npm": "253040031" },
  { "nama": "MOCHAMAD RAFY FAUZAN", "npm": "253040032" },
  { "nama": "REISYA PRASETYA GANDHI", "npm": "253040033" },
  { "nama": "FAJAR SIDIQ", "npm": "253040034" },
  { "nama": "Paul Kabes", "npm": "253040035" },
  { "nama": "Jasmine Aghnia Maharani", "npm": "253040036" },
  { "nama": "Muhammad Rizky Prathama", "npm": "253040037" },
  { "nama": "AULIA PUTRI SYALSYABILAH", "npm": "253040038" },
  { "nama": "MUHAMMAD RASHYA FIRMANSYAH", "npm": "253040039" },
  { "nama": "FAISAL DWI RAHARJA", "npm": "253040040" },
  { "nama": "Aby Lutfi Al-Hakim", "npm": "253040041" },
  { "nama": "SHINDY PURWANTY", "npm": "253040042" },
  { "nama": "FEBRA KAHFI SAPUTRA", "npm": "253040043" },
  { "nama": "Sirhan arriyad dhiaurahman", "npm": "253040044" },
  { "nama": "TRYCHIA SAGINTA ANANDA", "npm": "253040045" },
  { "nama": "FRAYOGA NURSOFYAN", "npm": "253040046" },
  { "nama": "FARREL NIZRI FAHREZI", "npm": "253040047" },
  { "nama": "FIKRI RAHMADAN", "npm": "253040048" },
  { "nama": "MUHAMMAD RAFLI AQSHAL", "npm": "253040050" },
  { "nama": "OCKY YUDHA PRANATA", "npm": "253040051" },
  { "nama": "MUHAMMAD RIFALDI", "npm": "253040052" },
  { "nama": "MUHAMAD RIFKI MAULANA", "npm": "253040053" },
  { "nama": "FIKRIY FAUZIYAH", "npm": "253040054" },
  { "nama": "MUHAMMAD RAFFA AZHAR FADHULLAH", "npm": "253040055" },
  // { "nama": "RAFFI FATAHILAH SUDRAJAT", "npm": "253040056" },
  { "nama": "MUHAMAD AJIB FIRDAUS SUPIAN", "npm": "253040057" },
  { "nama": "YUSRIA NURHASANAH", "npm": "253040058" },
  { "nama": "MAGDALENA YOSEPINA BUINEY", "npm": "253040059" },
  { "nama": "MOCHAMMAD FAREL FIKRIAWAN", "npm": "253040060" },
  { "nama": "DWI YULIANTO PUTRA", "npm": "253040061" },
  { "nama": "MUHAMMAD ALZETA CAHYA PUTRA", "npm": "253040062" },
  { "nama": "EVAN WIRA PRATAMA", "npm": "253040063" },
  { "nama": "HERY PAPUA WONDA", "npm": "253040065" },
  { "nama": "RASYID HAKIM RIFATULLAH", "npm": "253040066" },
  { "nama": "BAYU MUBAROK", "npm": "253040068" },
  { "nama": "MUHAMAD RAMDHAN NURWAHID", "npm": "253040070" },
  { "nama": "EGI RIZKI YANA", "npm": "253040071" },
  { "nama": "MOCH FADHLIL FADILAH", "npm": "253040072" },
  { "nama": "YEDIJA BONSAPIA WARIKAR", "npm": "253040073" },
  { "nama": "TURMIDZI GILANG RAMADHAN", "npm": "253040078" },
  { "nama": "GINANJAR AL FARIZI", "npm": "253040079" },
  { "nama": "NAYLA AMELIA PUTRI", "npm": "253040080" },
  { "nama": "M. IQBAL APIP ALMASYKUR", "npm": "253040081" },
  { "nama": "FAKHRI ZAIDI DJULISTIAWAN", "npm": "253040082" },
  { "nama": "NOVIA FITRIANI", "npm": "253040083" },
  { "nama": "BILLY BARBAR SAKHA", "npm": "253040084" },
  { "nama": "ADINDA PUTRI KIRANA", "npm": "253040085" },
  { "nama": "HANURA NUR RIDWAN", "npm": "253040086" },
  { "nama": "MUHAMMAD RAIHAN ALZENA", "npm": "253040087" },
  { "nama": "KEISYA RATNA YOANDA SELIA", "npm": "253040088" },
  // { "nama": "NAILA RASHIEKA OKTAVIATRI", "npm": "253040089" },
  { "nama": "HANA BENITA PUTRI", "npm": "253040090" },
  { "nama": "HILAL ARASY ALPAPA", "npm": "253040092" },
  { "nama": "MUHAMMAD AZHRIEL NASYAWAN HIDAYAT", "npm": "253040095" },
  { "nama": "DIMAS ANANTA PRAYOGO", "npm": "253040077" }
];

async function main() {
  try {    
    const csvData = [];
    csvData.push(['NPM', 'NAMA', 'USERNAME', 'PASSWORD', 'ROLE']);
    
    let successCount = 0;
    let errorCount = 0;

    for (const item of dataPeserta) {
      try {
        const randomPassword = generateRandomPassword(5);
        const hashedPassword = await hashPassword(randomPassword);
        
        const namaUppercase = item.nama.toUpperCase();
        
        const user = await prisma.user.upsert({
          where: {
            username: item.npm, 
          },
          update: {
            password: hashedPassword,
            role: Role.PESERTA,
          },
          create: {
            username: item.npm, 
            password: hashedPassword,
            role: Role.PESERTA,
            peserta: {
              create: {
                npm: item.npm,
                nama: namaUppercase,
                firstLogin: true,
              },
            },
          },
          include: {
            peserta: true,
          },
        });

        csvData.push([
          item.npm,
          namaUppercase,
          item.npm,
          randomPassword,
          'PESERTA'
        ]);

        successCount++;
        
      } catch (error) {
        errorCount++;
        console.error(`Error : ${item.nama} (${item.npm}) - ${error.message}`);
      }
    }

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const csvFilePath = path.join(__dirname, 'credentials-peserta.csv');
    fs.writeFileSync(csvFilePath, csvContent, 'utf-8');

    console.log(`Berhasil: ${successCount} peserta`);
    console.log(`Gagal: ${errorCount} peserta`);
    console.log(`Total: ${dataPeserta.length} peserta`);
    console.log('File CSV: credentials-peserta.csv');

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