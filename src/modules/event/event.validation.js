const Joi = require('joi');

const createEventSchema = Joi.object({
  nama: Joi.string().required().messages({
    'any.required': 'Nama event wajib diisi',
    'string.empty': 'Nama event tidak boleh kosong',
  }),
});

const updateEventSchema = Joi.object({
  nama: Joi.string().optional(),
});

module.exports = {
  createEventSchema,
  updateEventSchema,
};