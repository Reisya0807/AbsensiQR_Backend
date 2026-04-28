const Joi = require('joi');

const createRundownSchema = Joi.object({
  judul: Joi.string().required().messages({
    'any.required': 'Judul wajib diisi',
  }),
  deskripsi: Joi.string().optional().allow(''),
  waktuMulai: Joi.date().iso().required().messages({
    'any.required': 'Waktu mulai wajib diisi',
    'date.format': 'Format waktu tidak valid',
  }),
  waktuSelesai: Joi.date().iso().greater(Joi.ref('waktuMulai')).required().messages({
    'any.required': 'Waktu selesai wajib diisi',
    'date.greater': 'Waktu selesai harus lebih besar dari waktu mulai',
  }),
  isHighlight: Joi.boolean().optional(),
});

const updateRundownSchema = Joi.object({
  judul: Joi.string().optional(),
  deskripsi: Joi.string().optional().allow(''),
  waktuMulai: Joi.date().iso().optional(),
  waktuSelesai: Joi.date().iso().optional(),
  isHighlight: Joi.boolean().optional(),
});

module.exports = {
  createRundownSchema,
  updateRundownSchema,
};