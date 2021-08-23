const Joi = require('joi');

const schema = Joi.object({
  tags: Joi.string()
    .required()
    .error(() => {
      return new Error('tags parameter is required');
    }),
  sortBy: Joi.string()
    .valid('id', 'popularity', 'likes', 'reads')
    .error(() => {
      return new Error('sortBy parameter is invalid');
    }),
  direction: Joi.string()
    .valid('asc', 'desc')
    .error(() => {
      return new Error('direction parameter is invalid');
    }),
});

module.exports = schema;
