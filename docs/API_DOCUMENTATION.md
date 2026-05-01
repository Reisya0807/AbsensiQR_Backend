# API Documentation

## Base URL
```
http://localhost:${SESUAI PORT ENV}}/api
```

## Table of Contents
- [Response Format](#response-format)
- [Authentication](#authentication)
- [Auth Endpoints](#auth-endpoints)
- [User Endpoints](#user-endpoints)
- [QR Code Endpoints](#qr-code-endpoints)
- [Attendance Endpoints](#attendance-endpoints)
- [Rundown Endpoints](#rundown-endpoints)
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
      "portofolio": null,
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // NAH INI FRONTEND HARUS SIMPAN MAU ITU DI LOCALSTORAGE DLL
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
        "portofolio": null,
        "firstLogin": true // KALAU FIRST LOGIN INI TAMBAHAN YA
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
      "portofolio": "https://ajibfirda.us", // CONTOH
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
    "portofolio": "https://ajibfirda.us",
    "firstLogin": false
  }
}
```

---

### 5. Update Portfolio

**Endpoint:** `PUT /users/portfolio`

**Authorization:** Required (Bearer Token)

**Roles:** PESERTA only

**Request Body:**
```json
{
  "portofolio": "https://ajibfirda.us"
}
```

**Validation Rules:**
- `portofolio`: Optional, can be empty string

**Success Response (200):**
```json
{
  "success": true,
  "message": "Portfolio berhasil diupdate",
  "data": {
    "id": "peserta-uuid",
    "npm": "2106123456",
    "nama": "John Doe",
    "email": "john@example.com",
    "portofolio": "https://ajibfirda.us",
    "firstLogin": false
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

---

### 6. Change Password

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

### 7. Reset Password (Sekretaris Only)

**Endpoint:** `POST /users/reset-password`

**Authorization:** Required (Bearer Token)

**Roles:** SEKRETARIS only

**Request Body:**
```json
{
  "userId": "uuid-of-user-to-reset" // UNTUK DAPETIN INI HARUS GET ALL USER DATA DLU YA JADI INI UUID NYA DARI USER BUKAN PESERTA
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

## QR Code Endpoints

### 8. Generate QR Code

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
    "expiresAt": "2024-01-20T10:05:00Z", // kALAU UDAH EXPIRED DI PERLUKAN GENERATE ULG YA UTK SEKRETATIS
    "qrCodeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." // BASE64 ENCODED PNG IMAGE YA
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

### 9. Scan QR Code (Absen via QR)

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

### 10. Manual Attendance

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

### 11. Get Attendance

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

## Rundown Endpoints (INI IGNORE AJA YA KALAU GA KEPAKE INI AKU TAMBAHAN AJA KALAU BUTUH)

### 12. Get All Rundown

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

### 13. Get Rundown by ID

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

### 14. Create Rundown

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

### 15. Update Rundown

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

### 16. Delete Rundown

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

## Peserta Endpoints

### 17. Get All Peserta

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
          "portofolio": "https://ajibfirda.us",
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

### 18. Get Peserta by User ID

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
      "portofolio": "https://ajibfirda.us",
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
curl -X POST http://localhost:5000/api/auth/register \
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
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Generate QR Code
```bash
curl -X POST http://localhost:5000/api/qr/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Scan QR Code
```bash
curl -X POST http://localhost:5000/api/attendance/scan \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "QR_TOKEN_HERE"
  }'
```

## Notes

1. **Token Expiration**: JWT tokens expire after 24 hours by default
2. **QR Code Expiration**: QR codes expire after 1 minutes by default
3. **Pagination**: Default page size is 50 items
4. **Date Format**: All dates use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
5. **Password Security**: Passwords are hashed using bcrypt with 10 salt rounds
6. **First Login**: `firstLogin` flag is set to `false` after peserta updates their portfolio (INI OPTIONAL AJA)

---
