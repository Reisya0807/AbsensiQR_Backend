const express = require('express');
const router = express.Router();

// Import middlewares
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validator');

// Import controllers
const authController = require('../modules/auth/auth.controller');
const userController = require('../modules/users/user.controller');
const qrController = require('../modules/qr/qr.controller');
const attendanceController = require('../modules/attendance/attendance.controller');
const rundownController = require('../modules/rundown/rundown.controller');
const pesertaController = require('../modules/peserta/peserta.controller');
const portfolioController = require('../modules/portfolio/portfolio.controller');
const eventController = require('../modules/event/event.controller');
const certificateController = require('../modules/certificate/certificate.controller');

// Import validations
const { registerSchema, loginSchema } = require('../modules/auth/auth.validation');
const { updateProfileSchema, changePasswordSchema, resetPasswordSchema } = require('../modules/users/user.validation');
const { scanQRSchema, manualAttendanceSchema } = require('../modules/attendance/attendance.validation');
const { createRundownSchema, updateRundownSchema } = require('../modules/rundown/rundown.validation');
const { createPortfolioSchema, updatePortfolioSchema } = require('../modules/portfolio/portfolio.validation');
const { createEventSchema, updateEventSchema } = require('../modules/event/event.validation');
const { createCertificateSchema, updateCertificateSchema } = require('../modules/certificate/certificate.validation');

// ==================== PUBLIC ROUTES ====================
router.post('/auth/register', validate(registerSchema), authController.register);
router.post('/auth/login', validate(loginSchema), authController.login);

// ==================== PROTECTED ROUTES ====================

// --- User Routes ---
router.get('/users/profile', authenticate, userController.getProfile);
router.put('/users/profile', authenticate, validate(updateProfileSchema), userController.updateProfile);
router.put('/users/change-password', authenticate, validate(changePasswordSchema), userController.changePassword);
router.post('/users/reset-password', authenticate, authorize('SEKRETARIS'), validate(resetPasswordSchema), userController.resetPassword);

// --- Portfolio Routes (Peserta only) ---
router.get('/portfolio', authenticate, portfolioController.getMyPortfolios);
router.get('/portfolio/:id', authenticate, portfolioController.getById);
router.post('/portfolio', authenticate, validate(createPortfolioSchema), portfolioController.create);
router.put('/portfolio/:id', authenticate, validate(updatePortfolioSchema), portfolioController.update);
router.delete('/portfolio/:id', authenticate, portfolioController.delete);

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

// --- Event Routes ---
router.get('/event', authenticate, eventController.getAll);
router.get('/event/:id', authenticate, eventController.getById);
router.post('/event', authenticate, authorize('SEKRETARIS'), validate(createEventSchema), eventController.create);
router.put('/event/:id', authenticate, authorize('SEKRETARIS'), validate(updateEventSchema), eventController.update);
router.delete('/event/:id', authenticate, authorize('SEKRETARIS'), eventController.delete);

// --- Certificate Routes ---
router.get('/certificate/my', authenticate, certificateController.getMyCertificates); 
router.get('/certificate', authenticate, authorize('SEKRETARIS'), certificateController.getAll); 
router.get('/certificate/:id', authenticate, certificateController.getById);
router.get('/certificate/peserta/:pesertaId', authenticate, authorize('SEKRETARIS'), certificateController.getByPesertaId); 
router.post('/certificate', authenticate, authorize('SEKRETARIS'), validate(createCertificateSchema), certificateController.create);
router.put('/certificate/:id', authenticate, authorize('SEKRETARIS'), validate(updateCertificateSchema), certificateController.update);
router.delete('/certificate/:id', authenticate, authorize('SEKRETARIS'), certificateController.delete);

// --- Peserta Routes (Sekretaris only) ---
router.get('/peserta', authenticate, authorize('SEKRETARIS'), pesertaController.getAll);
router.get('/peserta/:userId', authenticate, authorize('SEKRETARIS'), pesertaController.getById);

module.exports = router;