const { errorResponse } = require('../utils/response');


function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return errorResponse(res, 400, 'Validation error', errors);
    }

    req[property] = value;
    next();
  };
}

module.exports = validate;