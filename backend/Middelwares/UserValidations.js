const Joi = require('joi');

const signupSchema = Joi.object({
    firstname: Joi.string()
        .trim()
        .min(2)
        .max(30)
        .required(),

    lastname: Joi.string()
        .trim()
        .min(2)
        .max(30)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .max(100)
        .required(),

    VerifyCode: Joi.string()
        .trim()
        .required(),

    role: Joi.string()
        .valid('user', 'admin', 'artist')
        .default('user')
});

const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .max(100)
        .required(),

    VerifyCode: Joi.string()
        .trim()
        .required()
});

const signupValidation = (req, res, next) => {

    const { error, value } = signupSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details.map(err => err.message)
        });
    }

    req.body = value;
    next();
};

const loginValidation = (req, res, next) => {

    const { error, value } = loginSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details.map(err => err.message)
        });
    }

    req.body = value;
    next();
};

module.exports = {
    signupValidation,
    loginValidation
};