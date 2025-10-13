import * as yup from 'yup'

const tagSchema = yup.string()
  .trim()
  .min(1, 'Each tag must be at least 1 character long.')
  .max(50, 'Tags cannot exceed 50 characters.')
  .strict(true);

export const createTodoSchema = yup.object({
  text: yup.string()
    .trim()
    .min(3, 'must be at least 3 characters long.')
    .max(255, 'Max 255 characters.')
    .required('Task is required.'),

  priority: yup.number()
    .integer('Priority must be an integer.')
    .min(1, 'Priority must be at least 1.')
    .max(3, 'Priority cannot exceed 3.')
    .default(2)
    .optional(),

  completed: yup.boolean()
    .default(false)
    .optional(),

  tags: yup.array()
    .of(tagSchema)
    .optional()
});

export const updateTodoSchema = yup.object({
  text: yup.string()
    .trim()
    .min(3, 'must be at least 3 characters long.')
    .max(255, 'Task cannot exceed 255 characters.')
    .optional(),

  priority: yup.number()
    .integer('Priority must be an integer.')
    .min(1, 'Priority must be at least 1.')
    .max(3, 'Priority cannot exceed 3.')
    .optional(),

  completed: yup.boolean().optional(),

  tags: yup.array()
    .of(tagSchema)
    .optional()
})
  .test('not-empty', 'The request body must contain at least one field to update.', (value) => { //not-empty is the name of the validation test, error message,function;
    return !!Object.keys(value).length;
  });