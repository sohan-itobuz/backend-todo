

export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { aboutEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};