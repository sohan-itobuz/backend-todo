import * as yup from 'yup'

export const userSchema = yup.object({
  id: yup.required(),
  text: yup.string().required('text is required'),
  priority: yup.required('priority is required'),
  tags: yup.string().notRequired(),
});