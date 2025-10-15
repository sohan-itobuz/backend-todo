import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import user from "../models/user.js";

dotenv.config();

export default async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (!accessToken) {
      return res.status(401).json({
        message: 'Access denied. Invalid authorization header.'
      })
    }

    console.log(accessToken);
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const uId = decoded.userId;
    const User = user.findById({ uId })
    // console.log(User);
    req.user = User;
    return next();

  } catch (error) {
    console.log(error);
    res.status(401);
    next(error)
  }
}

