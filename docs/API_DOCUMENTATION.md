# API Documentation

## Base URL
```
http://localhost:${SESUAI PORT ENV}/api
```

## Table of Contents
- [Response Format](#response-format)
- [Authentication](#authentication)
- [Auth Endpoints](#auth-endpoints)
- [User Endpoints](#user-endpoints)
- [Portfolio Endpoints](#portfolio-endpoints)
- [QR Code Endpoints](#qr-code-endpoints)
- [Attendance Endpoints](#attendance-endpoints)
- [Rundown Endpoints](#rundown-endpoints)
- [Event Endpoints](#event-endpoints)
- [Certificate Endpoints](#certificate-endpoints)
- [Peserta Endpoints](#peserta-endpoints)
- [Error Codes](#error-codes)

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Response data (optional)
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    // Error details (optional)
  }
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "username",
      "message": "Username wajib diisi"
    },
    {
      "field": "password",
      "message": "Password minimal 6 karakter"
    }
  ]
}
```

### Pagination Response
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {
    "data": [
      // Array of items
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3
    }
  }
}
```

---

## Authentication

### Authorization Header
Semua endpoint yang memerlukan autentikasi harus menyertakan token JWT di header:

```
Authorization: Bearer <your-jwt-token>
```

jadi nnti ketika login FRONTEND DI PERLUKAN UNTUK MENYIMPAN DATA JWT HASIL RETURN RESPONSE DARI API LOGIN

### Role-Based Access
- **PESERTA**: Peserta/participant
- **SEKRETARIS**: Administrator/Secretary

---

## Auth Endpoints

### 1. Register User (INI OPTIONAL YA TAKUT NYA ADA PERUBAHAN DARI MEETING)

**Endpoint:** `POST /auth/register`

**Authorization:** Not required

**Request Body:**

For PESERTA:
```json
{
  "username": "john_doe",
  "password": "password123",
  "role": "PESERTA",
  "npm": "253040001",
  "nama": "John Doe",
  "email": "john@example.com"
}
```

For SEKRETARIS:
```json
{
  "username": "admin_user",
  "password": "password123",
  "role": "SEKRETARIS",
  "nama": "Admin User",
  "npm": "253040001"
}
```

**Validation Rules:**
- `username`: Required, alphanumeric, 3-30 characters
- `password`: Required, minimum 6 characters
- `role`: Required, must be "PESERTA" or "SEKRETARIS"
- `npm`: Required if role is PESERTA
- `nama`: Required
- `email`: Optional, must be valid email format
- `npm`: Optional for SEKRETARIS

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": "uuid-here",
    "username": "john_doe",
    "role": "PESERTA",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z",
    "peserta": {
      "id": "peserta-uuid",
      "npm": "253040001",
      "nama": "John Doe",
      "email": "john@example.com",
      "firstLogin": true
    }
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "Data sudah ada (duplicate)",
  "errors": {
    "field": ["username"]
  }
}
```

---

### 2. Login

**Endpoint:** `POST /auth/login`

**Authorization:** Not required

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Validation Rules:**
- `username`: Required
- `password`: Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "username": "john_doe",
      "role": "PESERTA",
      "firstLogin": true,
      "profile": {
        "id": "peserta-uuid",
        "npm": "253040001",
        "nama": "John Doe",
        "email": "john@example.com",
        "firstLogin": true
      }
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Username atau password salah"
}
```

---

## User Endpoints

### 3. Get Profile

**Endpoint:** `GET /users/profile`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA, SEKRETARIS

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data profile berhasil diambil",
  "data": {
    "id": "uuid-here",
    "username": "john_doe",
    "role": "PESERTA",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z",
    "peserta": {
      "id": "peserta-uuid",
      "npm": "2106123456",
      "nama": "John Doe",
      "email": "john@example.com",
      "firstLogin": false
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Token tidak ditemukan"
}
```

---

### 4. Update Profile

**Endpoint:** `PUT /users/profile`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA, SEKRETARIS

**Request Body:**

For PESERTA:
```json
{
  "nama": "John Doe Updated",
  "email": "newemail@example.com"
}
```

For SEKRETARIS:
```json
{
  "nama": "Admin Updated",
  "npm": "198501012010011002"
}
```

**Validation Rules:**
- All fields are optional
- `email`: Must be valid email format if provided

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile berhasil diupdate",
  "data": {
    "id": "peserta-uuid",
    "npm": "2106123456",
    "nama": "John Doe Updated",
    "email": "newemail@example.com",
    "firstLogin": false
  }
}
```

---

### 5. Change Password

**Endpoint:** `PUT /users/change-password`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA, SEKRETARIS

**Request Body:**
```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword456",
  "confirmPassword": "newpassword456"
}
```

**Validation Rules:**
- `oldPassword`: Required
- `newPassword`: Required, minimum 6 characters
- `confirmPassword`: Required, must match newPassword

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password berhasil diubah"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Password lama tidak sesuai"
}
```

**Error Response (400 - Validation):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "confirmPassword",
      "message": "Konfirmasi password tidak cocok"
    }
  ]
}
```

---

### 6. Reset Password (Sekretaris Only)

**Endpoint:** `POST /users/reset-password`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Request Body:**
```json
{
  "userId": "uuid-of-user-to-reset"
}
```

**Validation Rules:**
- `userId`: Required, must be valid UUID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password berhasil direset",
  "data": {
    "username": "john_doe",
    "newPassword": "a1b2c3d4"
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya sekretaris yang bisa reset password"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User tidak ditemukan"
}
```

---

## Portfolio Endpoints

### 7. Get My Portfolios

**Endpoint:** `GET /portfolio`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA only

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data portfolio berhasil diambil",
  "data": [
    {
      "id": "portfolio-uuid-1",
      "title": "Website E-Commerce",
      "description": "Membuat website e-commerce dengan React dan Node.js",
      "link": "https://github.com/johndoe/ecommerce",
      "pesertaId": "peserta-uuid",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    },
    {
      "id": "portfolio-uuid-2",
      "title": "Mobile App Todo List",
      "description": "Aplikasi todo list menggunakan React Native",
      "link": "https://github.com/johndoe/todoapp",
      "pesertaId": "peserta-uuid",
      "createdAt": "2024-01-21T14:30:00Z",
      "updatedAt": "2024-01-21T14:30:00Z"
    }
  ]
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya peserta yang memiliki portfolio"
}
```

---

### 8. Get Portfolio by ID

**Endpoint:** `GET /portfolio/:id`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA only

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data portfolio berhasil diambil",
  "data": {
    "id": "portfolio-uuid-1",
    "title": "Website E-Commerce",
    "description": "Membuat website e-commerce dengan React dan Node.js",
    "link": "https://github.com/johndoe/ecommerce",
    "pesertaId": "peserta-uuid",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya peserta yang memiliki portfolio"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Portfolio tidak ditemukan"
}
```

---

### 9. Create Portfolio

**Endpoint:** `POST /portfolio`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA only

**Request Body:**
```json
{
  "title": "Website E-Commerce",
  "description": "Membuat website e-commerce dengan React dan Node.js",
  "link": "https://github.com/johndoe/ecommerce"
}
```

**Validation Rules:**
- `title`: Required, cannot be empty
- `description`: Required, cannot be empty
- `link`: Optional, must be valid URL if provided, can be empty string

**Success Response (201):**
```json
{
  "success": true,
  "message": "Portfolio berhasil dibuat",
  "data": {
    "id": "portfolio-uuid-1",
    "title": "Website E-Commerce",
    "description": "Membuat website e-commerce dengan React dan Node.js",
    "link": "https://github.com/johndoe/ecommerce",
    "pesertaId": "peserta-uuid",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

**Note:** Setelah membuat portfolio pertama kali, field `firstLogin` pada peserta akan otomatis berubah menjadi `false`.

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya peserta yang bisa membuat portfolio"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "title",
      "message": "Title wajib diisi"
    }
  ]
}
```

---

### 10. Update Portfolio

**Endpoint:** `PUT /portfolio/:id`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA only

**Request Body:**
```json
{
  "title": "Website E-Commerce Updated",
  "description": "Updated description",
  "link": "https://github.com/johndoe/ecommerce-v2"
}
```

**Validation Rules:**
- All fields are optional
- `link`: Must be valid URL if provided, can be empty string

**Success Response (200):**
```json
{
  "success": true,
  "message": "Portfolio berhasil diupdate",
  "data": {
    "id": "portfolio-uuid-1",
    "title": "Website E-Commerce Updated",
    "description": "Updated description",
    "link": "https://github.com/johndoe/ecommerce-v2",
    "pesertaId": "peserta-uuid",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-22T15:00:00Z"
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya peserta yang bisa update portfolio"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Portfolio tidak ditemukan"
}
```

---

### 11. Delete Portfolio

**Endpoint:** `DELETE /portfolio/:id`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA only

**Success Response (200):**
```json
{
  "success": true,
  "message": "Portfolio berhasil dihapus"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya peserta yang bisa delete portfolio"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Portfolio tidak ditemukan"
}
```

---

## QR Code Endpoints

### 12. Generate QR Code

**Endpoint:** `POST /qr/generate`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "QR Code berhasil di-generate",
  "data": {
    "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    "expiresAt": "2024-01-20T10:05:00Z",
    "qrCodeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

**Response Fields:**
- `token`: Unique token untuk QR Code
- `expiresAt`: Waktu kadaluarsa QR Code (default 5 menit dari sekarang)
- `qrCodeImage`: Base64 encoded PNG image of QR Code

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya sekretaris yang bisa generate QR Code"
}
```

---

## Attendance Endpoints

### 13. Scan QR Code (Absen via QR)

**Endpoint:** `POST /attendance/scan`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA only

**Request Body:**
```json
{
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
}
```

**Validation Rules:**
- `token`: Required, must be valid QR token

**Success Response (201):**
```json
{
  "success": true,
  "message": "Absensi berhasil",
  "data": {
    "id": "attendance-uuid",
    "status": 1,
    "timestamp": "2024-01-20T10:00:00Z",
    "method": "QR_SCAN",
    "pesertaId": "peserta-uuid",
    "qrTokenId": "qr-token-uuid",
    "peserta": {
      "npm": "2106123456",
      "nama": "John Doe"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "QR Code tidak valid"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "QR Code sudah kadaluarsa"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Anda sudah absen"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya peserta yang bisa scan QR"
}
```

---

### 14. Manual Attendance

**Endpoint:** `POST /attendance/manual`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Request Body:**
```json
{
  "npm": "2106123456"
}
```

**Validation Rules:**
- `npm`: Required

**Success Response (201):**
```json
{
  "success": true,
  "message": "Absensi berhasil dicatat",
  "data": {
    "id": "attendance-uuid",
    "status": 1,
    "timestamp": "2024-01-20T10:00:00Z",
    "method": "MANUAL",
    "pesertaId": "peserta-uuid",
    "qrTokenId": null,
    "peserta": {
      "npm": "2106123456",
      "nama": "John Doe"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Data peserta tidak ditemukan"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya sekretaris yang bisa absen manual"
}
```

---

### 15. Get Attendance

**Endpoint:** `GET /attendance`

**Authorization:** Required (Bearer Token)

**Roles:** 
- PESERTA: Get own attendance only
- SEKRETARIS: Get all attendance with filters

**Query Parameters (Sekretaris only):**
- `date` (optional): Filter by date (format: YYYY-MM-DD)
- `npm` (optional): Filter by NPM (partial match)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Example Request:**
```
GET /attendance?date=2024-01-20&npm=2106&page=1&limit=50
```

**Success Response - SEKRETARIS (200):**
```json
{
  "success": true,
  "message": "Data absensi berhasil diambil",
  "data": {
    "data": [
      {
        "id": "attendance-uuid",
        "status": 1,
        "timestamp": "2024-01-20T10:00:00Z",
        "method": "QR_SCAN",
        "pesertaId": "peserta-uuid",
        "qrTokenId": "qr-token-uuid",
        "createdAt": "2024-01-20T10:00:00Z",
        "updatedAt": "2024-01-20T10:00:00Z",
        "peserta": {
          "npm": "2106123456",
          "nama": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3
    }
  }
}
```

**Success Response - PESERTA (200):**
```json
{
  "success": true,
  "message": "Data absensi berhasil diambil",
  "data": [
    {
      "id": "attendance-uuid",
      "status": 1,
      "timestamp": "2024-01-20T10:00:00Z",
      "method": "QR_SCAN",
      "pesertaId": "peserta-uuid",
      "qrTokenId": "qr-token-uuid",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

## Rundown Endpoints

### 16. Get All Rundown

**Endpoint:** `GET /rundown`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA, SEKRETARIS

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data rundown berhasil diambil",
  "data": [
    {
      "id": "rundown-uuid",
      "judul": "Opening Ceremony",
      "deskripsi": "Acara pembukaan event",
      "waktuMulai": "2024-01-20T08:00:00Z",
      "waktuSelesai": "2024-01-20T09:00:00Z",
      "isHighlight": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "rundown-uuid-2",
      "judul": "Keynote Speech",
      "deskripsi": "Pembicara utama",
      "waktuMulai": "2024-01-20T09:00:00Z",
      "waktuSelesai": "2024-01-20T10:30:00Z",
      "isHighlight": false,
      "createdAt": "2024-01-15T10:05:00Z",
      "updatedAt": "2024-01-15T10:05:00Z"
    }
  ]
}
```

---

### 17. Get Rundown by ID

**Endpoint:** `GET /rundown/:id`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA, SEKRETARIS

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data rundown berhasil diambil",
  "data": {
    "id": "rundown-uuid",
    "judul": "Opening Ceremony",
    "deskripsi": "Acara pembukaan event",
    "waktuMulai": "2024-01-20T08:00:00Z",
    "waktuSelesai": "2024-01-20T09:00:00Z",
    "isHighlight": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Rundown tidak ditemukan"
}
```

---

### 18. Create Rundown

**Endpoint:** `POST /rundown`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Request Body:**
```json
{
  "judul": "Opening Ceremony",
  "deskripsi": "Acara pembukaan event",
  "waktuMulai": "2024-01-20T08:00:00Z",
  "waktuSelesai": "2024-01-20T09:00:00Z",
  "isHighlight": true
}
```

**Validation Rules:**
- `judul`: Required
- `deskripsi`: Optional, can be empty string
- `waktuMulai`: Required, must be valid ISO 8601 date format
- `waktuSelesai`: Required, must be valid ISO 8601 date format, must be greater than waktuMulai
- `isHighlight`: Optional, boolean (default: false)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Rundown berhasil dibuat",
  "data": {
    "id": "rundown-uuid",
    "judul": "Opening Ceremony",
    "deskripsi": "Acara pembukaan event",
    "waktuMulai": "2024-01-20T08:00:00Z",
    "waktuSelesai": "2024-01-20T09:00:00Z",
    "isHighlight": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "waktuSelesai",
      "message": "Waktu selesai harus lebih besar dari waktu mulai"
    }
  ]
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke resource ini"
}
```

---

### 19. Update Rundown

**Endpoint:** `PUT /rundown/:id`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Request Body:**
```json
{
  "judul": "Opening Ceremony Updated",
  "deskripsi": "Updated description",
  "waktuMulai": "2024-01-20T08:30:00Z",
  "waktuSelesai": "2024-01-20T09:30:00Z",
  "isHighlight": false
}
```

**Validation Rules:**
- All fields are optional
- `waktuMulai`: Must be valid ISO 8601 date format if provided
- `waktuSelesai`: Must be valid ISO 8601 date format if provided

**Success Response (200):**
```json
{
  "success": true,
  "message": "Rundown berhasil diupdate",
  "data": {
    "id": "rundown-uuid",
    "judul": "Opening Ceremony Updated",
    "deskripsi": "Updated description",
    "waktuMulai": "2024-01-20T08:30:00Z",
    "waktuSelesai": "2024-01-20T09:30:00Z",
    "isHighlight": false,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T14:30:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Data tidak ditemukan"
}
```

---

### 20. Delete Rundown

**Endpoint:** `DELETE /rundown/:id`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Success Response (200):**
```json
{
  "success": true,
  "message": "Rundown berhasil dihapus"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Data tidak ditemukan"
}
```

---

## Event Endpoints

### 21. Get All Events

**Endpoint:** `GET /event`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA, SEKRETARIS

**Query Parameters:**
- `search` (optional): Search by event name or description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Example Request:**
```
GET /event?search=workshop&page=1&limit=20
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data event berhasil diambil",
  "data": {
    "data": [
      {
        "id": "event-uuid-1",
        "name": "Workshop Web Development",
        "description": "Belajar membuat website dari nol",
        "startDate": "2024-01-20T08:00:00Z",
        "endDate": "2024-01-20T17:00:00Z",
        "location": "Gedung A Lt. 3",
        "createdAt": "2024-01-10T10:00:00Z",
        "updatedAt": "2024-01-10T10:00:00Z"
      },
      {
        "id": "event-uuid-2",
        "name": "Seminar AI dan Machine Learning",
        "description": "Pengenalan AI dan ML untuk pemula",
        "startDate": "2024-01-25T09:00:00Z",
        "endDate": "2024-01-25T15:00:00Z",
        "location": "Auditorium Utama",
        "createdAt": "2024-01-12T14:00:00Z",
        "updatedAt": "2024-01-12T14:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 25,
      "totalPages": 1
    }
  }
}
```

---

### 22. Get Event by ID

**Endpoint:** `GET /event/:id`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA, SEKRETARIS

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data event berhasil diambil",
  "data": {
    "id": "event-uuid-1",
    "name": "Workshop Web Development",
    "description": "Belajar membuat website dari nol",
    "startDate": "2024-01-20T08:00:00Z",
    "endDate": "2024-01-20T17:00:00Z",
    "location": "Gedung A Lt. 3",
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T10:00:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Event tidak ditemukan"
}
```

---

### 23. Create Event

**Endpoint:** `POST /event`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Request Body:**
```json
{
  "name": "Workshop Web Development",
  "description": "Belajar membuat website dari nol",
  "startDate": "2024-01-20T08:00:00Z",
  "endDate": "2024-01-20T17:00:00Z",
  "location": "Gedung A Lt. 3"
}
```

**Validation Rules:**
- `name`: Required, cannot be empty
- `description`: Optional, can be empty string
- `startDate`: Required, must be valid ISO 8601 date format
- `endDate`: Required, must be valid ISO 8601 date format, must be greater than startDate
- `location`: Optional, can be empty string

**Success Response (201):**
```json
{
  "success": true,
  "message": "Event berhasil dibuat",
  "data": {
    "id": "event-uuid-1",
    "name": "Workshop Web Development",
    "description": "Belajar membuat website dari nol",
    "startDate": "2024-01-20T08:00:00Z",
    "endDate": "2024-01-20T17:00:00Z",
    "location": "Gedung A Lt. 3",
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T10:00:00Z"
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya sekretaris yang bisa membuat event"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "name",
      "message": "Nama event wajib diisi"
    }
  ]
}
```

---

### 24. Update Event

**Endpoint:** `PUT /event/:id`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Request Body:**
```json
{
  "name": "Workshop Web Development Updated",
  "description": "Updated description",
  "startDate": "2024-01-20T09:00:00Z",
  "endDate": "2024-01-20T18:00:00Z",
  "location": "Gedung B Lt. 2"
}
```

**Validation Rules:**
- All fields are optional
- `startDate`: Must be valid ISO 8601 date format if provided
- `endDate`: Must be valid ISO 8601 date format if provided

**Success Response (200):**
```json
{
  "success": true,
  "message": "Event berhasil diupdate",
  "data": {
    "id": "event-uuid-1",
    "name": "Workshop Web Development Updated",
    "description": "Updated description",
    "startDate": "2024-01-20T09:00:00Z",
    "endDate": "2024-01-20T18:00:00Z",
    "location": "Gedung B Lt. 2",
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya sekretaris yang bisa update event"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Event tidak ditemukan"
}
```

---

### 25. Delete Event

**Endpoint:** `DELETE /event/:id`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Success Response (200):**
```json
{
  "success": true,
  "message": "Event berhasil dihapus"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya sekretaris yang bisa delete event"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Event tidak ditemukan"
}
```

---

## Certificate Endpoints

### 26. Get My Certificates (Peserta)

**Endpoint:** `GET /certificate/my`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA only

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data sertifikat berhasil diambil",
  "data": [
    {
      "id": "certificate-uuid-1",
      "certificateNumber": "CERT-2024-001",
      "certificateType": "PESERTA",
      "softFile": "https://drive.google.com/file/d/xxxxx",
      "issuedAt": "2024-01-20T10:00:00Z",
      "eventId": "event-uuid-1",
      "pesertaId": "peserta-uuid",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z",
      "event": {
        "id": "event-uuid-1",
        "name": "Workshop Web Development",
        "description": "Belajar membuat website dari nol",
        "startDate": "2024-01-20T08:00:00Z",
        "endDate": "2024-01-20T17:00:00Z",
        "location": "Gedung A Lt. 3"
      }
    },
    {
      "id": "certificate-uuid-2",
      "certificateNumber": "CERT-2024-002",
      "certificateType": "KEJUARAAN",
      "softFile": "https://drive.google.com/file/d/yyyyy",
      "issuedAt": "2024-01-25T15:00:00Z",
      "eventId": "event-uuid-2",
      "pesertaId": "peserta-uuid",
      "createdAt": "2024-01-25T15:00:00Z",
      "updatedAt": "2024-01-25T15:00:00Z",
      "event": {
        "id": "event-uuid-2",
        "name": "Kompetisi Coding",
        "description": "Kompetisi pemrograman tingkat nasional",
        "startDate": "2024-01-25T09:00:00Z",
        "endDate": "2024-01-25T17:00:00Z",
        "location": "Auditorium Utama"
      }
    }
  ]
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya peserta yang memiliki sertifikat"
}
```

---

### 27. Get All Certificates (Sekretaris)

**Endpoint:** `GET /certificate`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Query Parameters:**
- `search` (optional): Search by certificate number, nama peserta, or npm
- `certificateType` (optional): Filter by certificate type (PESERTA, KEJUARAAN, PEMATERI)
- `eventId` (optional): Filter by event ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Example Request:**
```
GET /certificate?search=john&certificateType=PESERTA&page=1&limit=20
GET /certificate?eventId=event-uuid-1
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data sertifikat berhasil diambil",
  "data": {
    "data": [
      {
        "id": "certificate-uuid-1",
        "certificateNumber": "CERT-2024-001",
        "certificateType": "PESERTA",
        "softFile": "https://drive.google.com/file/d/xxxxx",
        "issuedAt": "2024-01-20T10:00:00Z",
        "eventId": "event-uuid-1",
        "pesertaId": "peserta-uuid",
        "createdAt": "2024-01-20T10:00:00Z",
        "updatedAt": "2024-01-20T10:00:00Z",
        "event": {
          "id": "event-uuid-1",
          "name": "Workshop Web Development",
          "description": "Belajar membuat website dari nol",
          "startDate": "2024-01-20T08:00:00Z",
          "endDate": "2024-01-20T17:00:00Z",
          "location": "Gedung A Lt. 3"
        },
        "peserta": {
          "id": "peserta-uuid",
          "npm": "2106123456",
          "nama": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100,
      "totalPages": 2
    }
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya sekretaris yang bisa melihat semua sertifikat"
}
```

---

### 28. Get Certificate by ID

**Endpoint:** `GET /certificate/:id`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA (own certificates only), SEKRETARIS (all certificates)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data sertifikat berhasil diambil",
  "data": {
    "id": "certificate-uuid-1",
    "certificateNumber": "CERT-2024-001",
    "certificateType": "PESERTA",
    "softFile": "https://drive.google.com/file/d/xxxxx",
    "issuedAt": "2024-01-20T10:00:00Z",
    "eventId": "event-uuid-1",
    "pesertaId": "peserta-uuid",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z",
    "event": {
      "id": "event-uuid-1",
      "name": "Workshop Web Development",
      "description": "Belajar membuat website dari nol",
      "startDate": "2024-01-20T08:00:00Z",
      "endDate": "2024-01-20T17:00:00Z",
      "location": "Gedung A Lt. 3"
    },
    "peserta": {
      "id": "peserta-uuid",
      "npm": "2106123456",
      "nama": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Response (403) - For PESERTA accessing other's certificate:**
```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke sertifikat ini"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Sertifikat tidak ditemukan"
}
```

---

### 29. Get Certificates by Peserta ID (Sekretaris)

**Endpoint:** `GET /certificate/peserta/:pesertaId`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data sertifikat berhasil diambil",
  "data": [
    {
      "id": "certificate-uuid-1",
      "certificateNumber": "CERT-2024-001",
      "certificateType": "PESERTA",
      "softFile": "https://drive.google.com/file/d/xxxxx",
      "issuedAt": "2024-01-20T10:00:00Z",
      "eventId": "event-uuid-1",
      "pesertaId": "peserta-uuid",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z",
      "event": {
        "id": "event-uuid-1",
        "name": "Workshop Web Development",
        "description": "Belajar membuat website dari nol",
        "startDate": "2024-01-20T08:00:00Z",
        "endDate": "2024-01-20T17:00:00Z",
        "location": "Gedung A Lt. 3"
      }
    }
  ]
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya sekretaris yang bisa melihat sertifikat peserta"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Peserta tidak ditemukan"
}
```

---

### 30. Create Certificate

**Endpoint:** `POST /certificate`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Request Body:**
```json
{
  "certificateNumber": "CERT-2024-001",
  "certificateType": "PESERTA",
  "softFile": "https://drive.google.com/file/d/xxxxx",
  "issuedAt": "2024-01-20T10:00:00Z",
  "eventId": "event-uuid-1",
  "pesertaId": "peserta-uuid"
}
```

**Validation Rules:**
- `certificateNumber`: Required, cannot be empty
- `certificateType`: Required, must be one of: PESERTA, KEJUARAAN, PEMATERI
- `softFile`: Required, must be valid URL (Google Drive link)
- `issuedAt`: Required, must be valid ISO 8601 date format
- `eventId`: Required, event must exist
- `pesertaId`: Required, peserta must exist

**Success Response (201):**
```json
{
  "success": true,
  "message": "Sertifikat berhasil dibuat",
  "data": {
    "id": "certificate-uuid-1",
    "certificateNumber": "CERT-2024-001",
    "certificateType": "PESERTA",
    "softFile": "https://drive.google.com/file/d/xxxxx",
    "issuedAt": "2024-01-20T10:00:00Z",
    "eventId": "event-uuid-1",
    "pesertaId": "peserta-uuid",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z",
    "event": {
      "id": "event-uuid-1",
      "name": "Workshop Web Development",
      "description": "Belajar membuat website dari nol",
      "startDate": "2024-01-20T08:00:00Z",
      "endDate": "2024-01-20T17:00:00Z",
      "location": "Gedung A Lt. 3"
    },
    "peserta": {
      "id": "peserta-uuid",
      "npm": "2106123456",
      "nama": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya sekretaris yang bisa membuat sertifikat"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Event tidak ditemukan"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Peserta tidak ditemukan"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "certificateType",
      "message": "Tipe sertifikat harus PESERTA, KEJUARAAN, atau PEMATERI"
    }
  ]
}
```

---

### 31. Update Certificate

**Endpoint:** `PUT /certificate/:id`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Request Body:**
```json
{
  "certificateNumber": "CERT-2024-001-UPDATED",
  "certificateType": "KEJUARAAN",
  "softFile": "https://drive.google.com/file/d/yyyyy",
  "issuedAt": "2024-01-21T10:00:00Z",
  "eventId": "event-uuid-2"
}
```

**Validation Rules:**
- All fields are optional
- `certificateType`: Must be one of: PESERTA, KEJUARAAN, PEMATERI if provided
- `softFile`: Must be valid URL if provided
- `issuedAt`: Must be valid ISO 8601 date format if provided
- `eventId`: Event must exist if provided
- Note: `pesertaId` cannot be changed after creation

**Success Response (200):**
```json
{
  "success": true,
  "message": "Sertifikat berhasil diupdate",
  "data": {
    "id": "certificate-uuid-1",
    "certificateNumber": "CERT-2024-001-UPDATED",
    "certificateType": "KEJUARAAN",
    "softFile": "https://drive.google.com/file/d/yyyyy",
    "issuedAt": "2024-01-21T10:00:00Z",
    "eventId": "event-uuid-2",
    "pesertaId": "peserta-uuid",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-22T14:30:00Z",
    "event": {
      "id": "event-uuid-2",
      "name": "Kompetisi Coding",
      "description": "Kompetisi pemrograman tingkat nasional",
      "startDate": "2024-01-25T09:00:00Z",
      "endDate": "2024-01-25T17:00:00Z",
      "location": "Auditorium Utama"
    },
    "peserta": {
      "id": "peserta-uuid",
      "npm": "2106123456",
      "nama": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya sekretaris yang bisa update sertifikat"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Sertifikat tidak ditemukan"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Event tidak ditemukan"
}
```

---

### 32. Delete Certificate

**Endpoint:** `DELETE /certificate/:id`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Success Response (200):**
```json
{
  "success": true,
  "message": "Sertifikat berhasil dihapus"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Hanya sekretaris yang bisa delete sertifikat"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Sertifikat tidak ditemukan"
}
```

---

## Peserta Endpoints

### 33. Get All Peserta

**Endpoint:** `GET /peserta`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Query Parameters:**
- `search` (optional): Search by username, nama, npm, or email
- `role` (optional): Filter by role (PESERTA/SEKRETARIS). Default: PESERTA
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Example Request:**
```
GET /peserta?search=john&page=1&limit=20
GET /peserta?role=SEKRETARIS
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data peserta berhasil diambil",
  "data": {
    "data": [
      {
        "userId": "user-uuid",
        "username": "john_doe",
        "role": "PESERTA",
        "createdAt": "2024-01-20T10:00:00Z",
        "peserta": {
          "id": "peserta-uuid",
          "npm": "2106123456",
          "nama": "John Doe",
          "email": "john@example.com",
          "firstLogin": false,
          "_count": {
            "attendances": 15
          }
        },
        "totalAbsensi": 15
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3
    }
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke resource ini"
}
```

---

### 34. Get Peserta by User ID

**Endpoint:** `GET /peserta/:userId`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data peserta berhasil diambil",
  "data": {
    "userId": "user-uuid",
    "username": "john_doe",
    "role": "PESERTA",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-25T15:30:00Z",
    "peserta": {
      "id": "peserta-uuid",
      "npm": "2106123456",
      "nama": "John Doe",
      "email": "john@example.com",
      "firstLogin": false,
      "totalAbsensi": 15,
      "recentAttendances": [
        {
          "id": "attendance-uuid",
          "status": 1,
          "timestamp": "2024-01-25T08:00:00Z",
          "method": "QR_SCAN",
          "pesertaId": "peserta-uuid",
          "qrTokenId": "qr-token-uuid",
          "createdAt": "2024-01-25T08:00:00Z",
          "updatedAt": "2024-01-25T08:00:00Z"
        }
      ]
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User tidak ditemukan"
}
```

---

## Error Codes

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Request tidak valid atau validation error |
| 401 | Unauthorized - Token tidak valid atau tidak ada |
| 403 | Forbidden - Tidak memiliki akses ke resource |
| 404 | Not Found - Resource tidak ditemukan |
| 409 | Conflict - Data duplicate (username, npm, dll) |
| 500 | Internal Server Error - Error di server |

### Common Error Messages

#### Authentication Errors
```json
{
  "success": false,
  "message": "Token tidak ditemukan"
}
```

```json
{
  "success": false,
  "message": "Token tidak valid atau sudah kadaluarsa"
}
```

```json
{
  "success": false,
  "message": "Username atau password salah"
}
```

#### Authorization Errors
```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke resource ini"
}
```

```json
{
  "success": false,
  "message": "Hanya sekretaris yang bisa mengakses endpoint ini"
}
```

#### Validation Errors
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "username",
      "message": "Username minimal 3 karakter"
    },
    {
      "field": "password",
      "message": "Password minimal 6 karakter"
    }
  ]
}
```

#### Database Errors
```json
{
  "success": false,
  "message": "Data sudah ada (duplicate)",
  "errors": {
    "field": ["username"]
  }
}
```

```json
{
  "success": false,
  "message": "Data tidak ditemukan"
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:2929/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123",
    "role": "PESERTA",
    "npm": "2106123456",
    "nama": "John Doe",
    "email": "john@example.com"
  }'
```

### Login
```bash
curl -X POST http://localhost:2929/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:2929/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Portfolio
```bash
curl -X POST http://localhost:2929/api/portfolio \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Website E-Commerce",
    "description": "Membuat website e-commerce dengan React dan Node.js",
    "link": "https://github.com/johndoe/ecommerce"
  }'
```

### Generate QR Code
```bash
curl -X POST http://localhost:2929/api/qr/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Scan QR Code
```bash
curl -X POST http://localhost:2929/api/attendance/scan \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "QR_TOKEN_HERE"
  }'
```

### Create Event
```bash
curl -X POST http://localhost:2929/api/event \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Workshop Web Development",
    "description": "Belajar membuat website dari nol",
    "startDate": "2024-01-20T08:00:00Z",
    "endDate": "2024-01-20T17:00:00Z",
    "location": "Gedung A Lt. 3"
  }'
```

### Create Certificate
```bash
curl -X POST http://localhost:2929/api/certificate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "certificateNumber": "CERT-2024-001",
    "certificateType": "PESERTA",
    "softFile": "https://drive.google.com/file/d/xxxxx",
    "issuedAt": "2024-01-20T10:00:00Z",
    "eventId": "event-uuid-1",
    "pesertaId": "peserta-uuid"
  }'
```

---

## Notes

1. **Token Expiration**: JWT tokens expire after 24 hours by default
2. **QR Code Expiration**: QR codes expire after 1 minutes by default
3. **Pagination**: Default page size is 50 items
4. **Date Format**: All dates use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
5. **Password Security**: Passwords are hashed using bcrypt with 10 salt rounds
6. **First Login**: `firstLogin` flag is set to `false` after peserta creates their first portfolio
7. **Certificate Types**: Three types available - PESERTA (participant), KEJUARAAN (competition/championship), PEMATERI (speaker/presenter)
8. **Portfolio**: Peserta can have multiple portfolio entries, each with title, description, and optional link
9. **Event-Certificate Relation**: Each certificate is linked to an event and a peserta
10. **Certificate Access**: 
    - PESERTA can only view their own certificates
    - SEKRETARIS can view, create, update, and delete all certificates

---