import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import tokenGenerator from "../services/tokenGenerator.js";
// import { refreshTokens } from "../controller/authController.js";
dotenv.config();


// export default function verifyToken(req, res, next) {
//   const secretKey = process.env.JWT_SECRET_KEY;
//   const secretRefKey = process.env.JWT_REFRESH_KEY;

//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   // const authRefHeader = req.headers["authorization"];
//   const refToken = authHeader && authHeader.split(" ")[2];

//   console.log(token, refToken);
//   if (!token) {
//     return res.status(401).json({ success: false, error: 'Access denied' });
//   }
//   try {
//     const decoder = jwt.verify(token, secretKey);
//     req.userId = decoder.userId;
//     next();
//   } catch (error) {
//     res.status(401).json({ success: false, error: error.message }); //invalid token 
//   }
// }

export default async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(' ')[1];
    const refreshToken = authHeader && authHeader.split(' ')[2];

    if (!accessToken) {
      return res.status(401).json({
        message: 'Access denied. No token provided.'
      })
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY)
      req.user = decoded
      return next()

    } catch (error) {
      if (error.name === 'TokenExpiredError' && refreshToken) {
        try {
          const refreshPayload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET_KEY
          )

          const newAccessToken = tokenGenerator.generateAccessToken({ userId: refreshPayload.userId }, process.env.JWT_SECRET_KEY, process.env.JWT_EXPIRATION);
          console.log(newAccessToken);

          res.setHeader('authorization', newAccessToken, refreshToken)

          // Set user from refresh token payload
          req.user = refreshPayload
          return next()
        } catch (refreshError) {
          // Refresh token is also invalid or expired
          return res.status(401).json({
            message: 'Session expired. Please login again.', refreshError: refreshError.message
          })
        }
      }

      return res.status(403).json({
        message: 'Invalid access token'
      })
    }
  } catch (error) {
    next(error)
  }
}

