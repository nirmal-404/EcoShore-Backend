const Joi = require('joi');

const createPostSchema = Joi.object({
  text: Joi.string().required().max(2000).messages({
    'string.empty': 'Post text is required',
    'string.max': 'Post text cannot exceed 2000 characters',
  }),
  mediaUrls: Joi.array().items(Joi.string().uri()).optional(),
  visibility: Joi.string()
    .valid('PUBLIC', 'AUTHENTICATED')
    .default('AUTHENTICATED'),
});

const createCommentSchema = Joi.object({
  text: Joi.string().required().max(2000).messages({
    'string.empty': 'Comment text is required',
    'string.max': 'Comment text cannot exceed 2000 characters',
  }),
});

const updatePostSchema = Joi.object({
  text: Joi.string().max(2000).optional(),
  mediaUrls: Joi.array().items(Joi.string().uri()).optional(),
  visibility: Joi.string().valid('PUBLIC', 'AUTHENTICATED').optional(),
}).min(1); // At least one field must be present

module.exports = {
  createPostSchema,
  createCommentSchema,
  updatePostSchema,
};
