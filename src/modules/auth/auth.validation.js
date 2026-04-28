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
  // Untuk PESERTA
  npm: Joi.when('role', {
    is: 'PESERTA',
    then: Joi.string().required().messages({
      'any.required': 'NPM wajib diisi untuk peserta',
    }),
    otherwise: Joi.forbidden(),
  }),
  nama: Joi.string().required().messages({
    'any.required': 'Nama wajib diisi',
  }),
  email: Joi.string().email().optional(),
  // Untuk SEKRETARIS
  npm: Joi.when('role', {
    is: 'SEKRETARIS',
    then: Joi.string().optional(),
    otherwise: Joi.forbidden(),
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