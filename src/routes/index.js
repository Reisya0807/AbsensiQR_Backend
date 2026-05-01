const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validator');

const authController = require('../modules/auth/auth.controller');
const userController = require('../modules/users/user.controller');
const qrController = require('../modules/qr/qr.controller');
const attendanceController = require('../modules/attendance/attendance.controller');
const rundownController = require('../modules/rundown/rundown.controller');
const pesertaController = require('../modules/peserta/peserta.controller');

const { registerSchema, loginSchema } = require('../modules/auth/auth.validation');
const { updateProfileSchema, updatePortfolioSchema, changePasswordSchema, resetPasswordSchema } = require('../modules/users/user.validation');
const { scanQRSchema, manualAttendanceSchema } = require('../modules/attendance/attendance.validation');
const { createRundownSchema, updateRundownSchema } = require('../modules/rundown/rundown.validation');

// ==================== PUBLIC ROUTES ====================
// router.post('/auth/register', validate(registerSchema), authController.register);
router.post('/auth/login', validate(loginSchema), authController.login);

// ==================== PROTECTED ROUTES ====================

// --- User Routes ---
router.get('/users/profile', authenticate, userController.getProfile);
router.put('/users/profile', authenticate, validate(updateProfileSchema), userController.updateProfile);
router.put('/users/portfolio', authenticate, validate(updatePortfolioSchema), userController.updatePortfolio);
router.put('/users/change-password', authenticate, validate(changePasswordSchema), userController.changePassword);
router.post('/users/reset-password', authenticate, authorize('SEKRETARIS'), validate(resetPasswordSchema), userController.resetPassword);

// --- QR Routes (Sekretaris only) ---
router.post('/qr/generate', authenticate, authorize('SEKRETARIS'), qrController.generateQR);

// --- Attendance Routes ---
router.post('/attendance/scan', authenticate, authorize('PESERTA'), validate(scanQRSchema), attendanceController.scanQR);
router.post('/attendance/manual', authenticate, authorize('SEKRETARIS'), validate(manualAttendanceSchema), attendanceController.manualAttendance);
router.get('/attendance', authenticate, attendanceController.getAttendance);

// --- Rundown Routes ---
router.get('/rundown', authenticate, rundownController.getAll);
router.get('/rundown/:id', authenticate, rundownController.getById);
router.post('/rundown', authenticate, authorize('SEKRETARIS'), validate(createRundownSchema), rundownController.create);
router.put('/rundown/:id', authenticate, authorize('SEKRETARIS'), validate(updateRundownSchema), rundownController.update);
router.delete('/rundown/:id', authenticate, authorize('SEKRETARIS'), rundownController.delete);

// --- Peserta Routes (Sekretaris only) ---
router.get('/peserta', authenticate, authorize('SEKRETARIS'), pesertaController.getAll);
router.get('/peserta/:userId', authenticate, authorize('SEKRETARIS'), pesertaController.getById);

module.exports = router;