const Joi = require('joi');

const createCertificateSchema = Joi.object({
  certificateNumber: Joi.string().required().messages({
    'any.required': 'Nomor sertifikat wajib diisi',
    'string.empty': 'Nomor sertifikat tidak boleh kosong',
  }),
  certificateType: Joi.string()
    .valid('PESERTA', 'KEJUARAAN', 'PEMATERI')
    .required()
    .messages({
      'any.only': 'Tipe sertifikat harus PESERTA, KEJUARAAN, atau PEMATERI',
      'any.required': 'Tipe sertifikat wajib diisi',
    }),
  softFile: Joi.string().uri().required().messages({
    'any.required': 'Link Google Drive wajib diisi',
    'string.uri': 'Link harus berupa URL yang valid',
  }),
  issuedAt: Joi.date().iso().required().messages({
    'any.required': 'Tanggal terbit wajib diisi',
    'date.format': 'Format tanggal tidak valid',
  }),
  eventId: Joi.string().required().messages({
    'any.required': 'Event ID wajib diisi',
  }),
  pesertaId: Joi.string().required().messages({
    'any.required': 'Peserta ID wajib diisi',
  }),
});

const updateCertificateSchema = Joi.object({
  certificateNumber: Joi.string().optional(),
  certificateType: Joi.string().valid('PESERTA', 'KEJUARAAN', 'PEMATERI').optional(),
  softFile: Joi.string().uri().optional(),
  issuedAt: Joi.date().iso().optional(),
  eventId: Joi.string().optional(),
});

module.exports = {
  createCertificateSchema,
  updateCertificateSchema,
};