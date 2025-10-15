import { ValidationError } from "yup";
//eslint-disable-next-line
export default function errorHandler(err, req, res, next) {
  console.log(err);

  if (res.statusCode < 400) {
    res.status(500);
  }

  if (err instanceof ValidationError) {
    console.log(err);
    res.json({
      success: false,
      message: err.errors.join(', '),
    });
  } else {
    res.json({ success: false, message: err.message });
  }
}