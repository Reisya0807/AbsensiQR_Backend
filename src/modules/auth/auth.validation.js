const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Username hanya boleh berisi huruf dan angka',
    'string.min': 'Username minimal 3 karakter',
    'string.max': 'Username maksimal 30 karakter',
    'any.required': 'Username wajib diisi',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password minimal 6 karakter',
    'any.required': 'Password wajib diisi',
  }),
  role: Joi.string().valid('SEKRETARIS', 'PESERTA').required().messages({
    'any.only': 'Role harus SEKRETARIS atau PESERTA',
    'any.required': 'Role wajib diisi',
  }),
  nama: Joi.string().required().messages({
    'any.required': 'Nama wajib diisi',
  }),
  email: Joi.string().email().optional(),
  npm: Joi.string().required().messages({
    'any.required': 'Nama wajib diisi',
  }),
});

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username wajib diisi',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password wajib diisi',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};