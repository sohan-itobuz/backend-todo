import { createTodoSchema, updateTodoSchema } from '../schemas/todoSchemas.js';
import { ValidationError } from 'yup';

const validate = (schema) => async (req, res, next) => {  //higher order function
  try {
    await schema.validate(req.body, {
      abortEarly: false, //returns all errors
      stripUnknown: true, //remove keys not defined in schema
      strict: false,
      noUnknown: true, //reject values not defined in schema
    });
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      const errorMessages = error.errors;

      return res.status(400).json({
        status: 'Validation Error',
        errors: errorMessages,
        details: error.inner.map((e) => ({ path: e.path, message: e.message })),
      });
    }
    next(error);
  }
};

export const validateCreateTodo = validate(createTodoSchema);
export const validateUpdateTodo = validate(updateTodoSchema);
