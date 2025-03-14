import * as Joi from 'joi';

// deleteUserValidation validator schema
export const deleteUserValidation = Joi.object({
  id: Joi.string().required().messages({
    'string.base': 'ID must be a string',
    'string.empty': 'ID is required',
    'any.required': 'ID is a required field',
  }),
});

// getUserValidation validator schema
export const getUserValidation = Joi.object({
  id: Joi.string().required().messages({
    'string.base': 'ID must be a string',
    'string.empty': 'ID is required',
    'any.required': 'ID is a required field',
  }),
});
// uploadProfile validator schema
export const uploadProfile = Joi.object({
  profile: Joi.string().required().messages({
    'string.base': 'profile must be a string',
    'string.empty': 'profile is required',
    'any.required': 'profile is a required field',
  }),
});

// updateUserValidation validator schema
export const updateUserValidation = Joi.object({
  fullName: Joi.string().optional().messages({
    'string.base': 'Full Name must be a string',
  }),
  email: Joi.string().email().optional().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
  }),
  dateOfBirth: Joi.date().optional().messages({
    'date.base': 'Date of Birth must be a valid date',
  }),
  address: Joi.string().optional().messages({
    'date.base': 'Date of Birth must be a valid date',
  }),
  phone: Joi.string().optional().messages({
    'string.base': 'Phone Number must be a string',
  }),
  cartId: Joi.string().uuid().optional().messages({
    'string.guid': 'User ID must be a valid UUID',
  }),
  role: Joi.string().optional().messages({
    'string.base': 'Role must be a string',
  }),
});

export const userIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid Order ID format',
    'any.required': 'Product ID is required',
  }),
});
