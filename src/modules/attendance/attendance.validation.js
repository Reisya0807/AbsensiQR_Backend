const Joi = require('joi');

const scanQRSchema = Joi.object({
    token: Joi.string().required().messages({
        'string.empty': 'Token QR tidak boleh kosong',
        'any.required': 'Token QR wajib diisi',
    }),
});

const manualAttendanceSchema = Joi.object({
    npm: Joi.string().required().messages({
        'string.empty': 'NPM tidak boleh kosong',
        'any.required': 'NPM wajib diisi',
    }),
});

module.exports = {
    scanQRSchema,
    manualAttendanceSchema,
};