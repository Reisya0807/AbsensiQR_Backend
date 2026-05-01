const Joi = require('joi');

const updateProfileSchema = Joi.object({
    nama: Joi.string().optional(),
    email: Joi.string().email().optional(),
    npm: Joi.string().optional(),
});

const updatePortfolioSchema = Joi.object({
    portofolio: Joi.string().allow('').optional(),
});

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required().messages({
        'any.required': 'Password lama wajib diisi',
    }),
    newPassword: Joi.string().min(6).required().messages({
        'string.min': 'Password baru minimal 6 karakter',
        'any.required': 'Password baru wajib diisi',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Konfirmasi password tidak cocok',
        'any.required': 'Konfirmasi password wajib diisi',
    }),
});

const resetPasswordSchema = Joi.object({
    userId: Joi.string().required().messages({
        'any.required': 'User ID wajib diisi',
    }),
});


module.exports = {
    updateProfileSchema,
    updatePortfolioSchema,
    changePasswordSchema,
    resetPasswordSchema,
};