import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import tokenGenerator from "../utils/tokenGenerator.js";
import { env } from "../config/envConfig.js";


export default class AuthController {
  registerUser = async (req, res, next) => {
    try {

      const { email, password } = req.body;

      const getUser = await User.findOne({ email });

      if (getUser) {
        return res.status(409).json({ success: false, message: 'User already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ email, password: hashedPassword });
      await user.save();

      res.status(201).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, Error: error.message });
      next(error);
    }
  };


  loginUser = async (req, res, next) => {
    try {
      const accessKey = env.JWT_SECRET_KEY;
      const refreshKey = env.JWT_REFRESH_KEY;
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Password not matched' });
      }

      if (!user.verified) {
        return res.status(401).json({ success: false, message: 'User is not verified.' })
      }

      const accessToken = tokenGenerator.generateAccessToken({ userId: user._id }, accessKey, env.JWT_EXPIRATION);

      const refreshToken = tokenGenerator.generateRefreshToken({ userId: user._id }, refreshKey, env.JWT_REFRESH_EXPIRATION);

      delete user._doc.password;

      res.status(200).json({ success: true, accessToken, refreshToken, user });
    } catch (error) {
      res.status(404).json({ error: `Login failed: ${error}` });
      next(error);
    }
  };


  setNewPasswordAfterOTP = async (req, res) => {
    const { email, newPassword } = req.body

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email and new password are required.',
      })
    }

    try {

      const user = await User.findOne({ email })
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found.' })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword
      await user.save()

      return res.status(200).json({
        success: true,
        message: 'Password updated successfully.',
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating the password.',
      })
    }
  }


  resetPassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.',
      })
    }

    try {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' })
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password)
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect.' })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword
      await user.save()

      return res.status(200).json({
        success: true,
        message: 'Password reset successfully.',
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: 'An error occurred while resetting the password.',
      })
    }
  }

  refreshAccessToken = (req, res) => {
    const refreshToken = req.headers['refresh-token'];

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh Token is required' });
    }
    try {
      const refreshPayload = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_KEY
      )
      const newAccessToken = tokenGenerator.generateAccessToken({ userId: refreshPayload.userId }, env.JWT_SECRET_KEY, env.JWT_EXPIRATION);
      const newRefreshToken = tokenGenerator.generateRefreshToken({ userId: refreshPayload.userId }, env.JWT_REFRESH_KEY, env.JWT_REFRESH_EXPIRATION);
      console.log(newAccessToken, newRefreshToken);

      return res.status(200).send({
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        message: 'New Access and Refresh Tokens generated successfully'
      });

    } catch (error) {
      return res.status(401).json({
        message: 'Session expired. Please login again.', error: error.message
      })
    }
  }
}