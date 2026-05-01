# Attendance QR Backend
---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL / MySQL
- **Authentication**: JSON Web Token (JWT)
- **Validation**: Joi
- **Security**: bcrypt (hash password)
- **QR Generator**: qrcode
- **Dev Tools**: Nodemon

## Environment Setup

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

### Konfigurasi `.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database (pilih salah satu)

# PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/aplikasi-sa"

# MySQL
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/aplikasi-sa"

# JWT
JWT_SECRET="your_secret_key"
JWT_EXPIRES_IN=24h

# QR Token
QR_TOKEN_EXPIRES_MINUTES=1
```

**Penting:**
Kalau ganti database (PostgreSQL - MySQL), jangan lupa ubah juga di:

```
src/prisma/schema.prisma
```

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Prisma Setup

Generate Prisma Client:

```bash
npm run prisma:generate
```

Jalankan migration:

```bash
npm run prisma:migrate
```

Buka Prisma Studio (optional) (untuk mantau data kaya di phpmyadmin tampilannya):

```bash
npm run prisma:studio
```

---

## Seeding Database

Untuk isi data awal:

```bash
npm run seed
```

---

## Running the App

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

Server akan berjalan di:

```
http://localhost:{TERGANTUNG PORT YG DI SET DI .ENV}
```

## Notes

- Gunakan `NODE_ENV=development` untuk debugging query database
- Pastikan database sudah running sebelum migrate
- QR Token expired default: **1 menit**
