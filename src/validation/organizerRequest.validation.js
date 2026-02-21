const Joi = require('joi');

const createOrganizerRequestSchema = Joi.object({
  reason: Joi.string().required().max(500).messages({
    'string.empty': 'Reason is required',
    'string.max': 'Reason cannot exceed 500 characters',
  }),
});

const reviewOrganizerRequestSchema = Joi.object({
  action: Joi.string().valid('APPROVE', 'REJECT').required().messages({
    'any.only': 'Action must be either APPROVE or REJECT',
    'any.required': 'Action is required',
  }),
  rejectionReason: Joi.string().max(500).when('action', {
    is: 'REJECT',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

module.exports = {
  createOrganizerRequestSchema,
  reviewOrganizerRequestSchema,
};
