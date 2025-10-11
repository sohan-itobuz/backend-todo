import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export default function verifyToken(req, res, next) {
  const secretKey = process.env.JWT_SECRET_KEY;
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  try {
    const decoder = jwt.verify(token, secretKey);
    req.userId = decoder.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: error.message }); //invalid token 
  }
}