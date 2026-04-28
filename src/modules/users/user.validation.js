const Joi = require('joi');

const updateProfileSchema = Joi.object({
    nama: Joi.string().optional(),
    email: Joi.string().email().optional(),
    npm: Joi.string().optional(),
});

const updatePortfolioSchema = Joi.object({
    portofolio: Joi.string().allow('').optional(),
});

module.exports = {
    updateProfileSchema,
    updatePortfolioSchema,
};