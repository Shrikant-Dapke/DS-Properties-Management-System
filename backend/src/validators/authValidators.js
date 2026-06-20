'use strict';

/**
 * DS Properties — Auth Validators (Joi)
 */

const Joi = require('joi');

const loginValidator = Joi.object({
  username: Joi.string().min(3).max(50).required()
    .messages({
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must not exceed 50 characters',
      'any.required': 'Username is required',
    }),
  password: Joi.string().min(6).max(128).required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password must not exceed 128 characters',
      'any.required': 'Password is required',
    }),
});

const refreshValidator = Joi.object({
  refreshToken: Joi.string().required()
    .messages({
      'any.required': 'Refresh token is required',
    }),
});

const changePasswordValidator = Joi.object({
  currentPassword: Joi.string().required()
    .messages({
      'any.required': 'Current password is required',
    }),
  newPassword: Joi.string().min(8).max(128).required()
    .messages({
      'string.min': 'New password must be at least 8 characters',
      'string.max': 'New password must not exceed 128 characters',
      'any.required': 'New password is required',
    }),
});

module.exports = {
  loginValidator,
  refreshValidator,
  changePasswordValidator,
};
