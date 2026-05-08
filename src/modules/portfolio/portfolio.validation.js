const Joi = require('joi');

const createPortfolioSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Title wajib diisi',
    'string.empty': 'Title tidak boleh kosong',
  }),
  description: Joi.string().required().messages({
    'any.required': 'Description wajib diisi',
    'string.empty': 'Description tidak boleh kosong',
  }),
  link: Joi.string().uri().optional().allow('').messages({
    'string.uri': 'Link harus berupa URL yang valid',
  }),
});

const updatePortfolioSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  link: Joi.string().uri().optional().allow(''),
});

module.exports = {
  createPortfolioSchema,
  updatePortfolioSchema,
};