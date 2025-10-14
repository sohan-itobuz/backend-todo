import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import tokenGenerator from "../services/tokenGenerator.js";
// import { refreshTokens } from "../controller/authController.js";
dotenv.config();

export default async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(' ')[1];
    // const refreshToken = authHeader && authHeader.split(' ')[2];

    if (!accessToken) {
      return res.status(401).json({
        message: 'Access denied. No token provided.'
      })
    }

    try {
      console.log(accessToken);
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY)
      console.log(decoded);
      req.user = decoded
      return next()

    } catch (error) {
      //console.log(error)
      if (error.name === 'TokenExpiredError') {

        // res.redirect('localhost:3001/api/auth/protected/refresh-token'); // will redirect to refresh token with the help of interceptor in axios from frontend
        // try {
        //   const refreshPayload = jwt.verify(
        //     refreshToken,
        //     process.env.JWT_REFRESH_KEY
        //   )

        //   const newAccessToken = tokenGenerator.generateAccessToken({ userId: refreshPayload.userId }, process.env.JWT_SECRET_KEY, process.env.JWT_EXPIRATION);
        //   console.log(newAccessToken);

        //   res.setHeader('authorization', 'Bearer ' + newAccessToken + ' ' + refreshToken)

        //   // Set user from refresh token payload
        //   req.user = refreshPayload
        //   return next()
        // } catch (refreshError) {
        //   // Refresh token is also invalid or expired
        //   return res.status(401).json({
        //     message: 'Session expired. Please login again.', refreshError: refreshError.message
        //   })
        // }
      }

      return res.status(403).json({
        message: 'Invalid access token'
      })
    }
  } catch (error) {
    next(error)
  }
}

