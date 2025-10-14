import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
// import Otp from "../models/otpModel.js";
import tokenGenerator from "../services/tokenGenerator.js";
import { LocalStorage } from "node-localstorage";
const localStorage = new LocalStorage('./scratch');

dotenv.config();

export const refreshTokens = [];

export default class AuthController {
  registerUser = async (req, res, next) => {
    try {

      const { email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      // console.log(email, password, hashedPassword);

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
      const accessKey = process.env.JWT_SECRET_KEY;
      const refreshKey = process.env.JWT_REFRESH_KEY;
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Password not matched' });
      }

      const accessToken = tokenGenerator.generateAccessToken(user._id, accessKey, process.env.JWT_EXPIRATION);

      const refreshToken = tokenGenerator.generateRefreshToken(user._id, refreshKey, process.env.JWT_REFRESH_EXPIRATION);

      refreshTokens.push(refreshToken);

      delete user._doc.password;
      res.status(200).json({ success: true, accessToken, refreshToken, user });
    } catch (error) {
      res.status(500).json({ error: `Login failed: ${error}` });
      next(error);
    }
  };

  logoutUser = async (req, res, next) => {
    try {
      const { userId } = req.body

      const user = await User.findById(userId)

      if (!user) {
        res.status(404)
        throw new Error('User not found')
      }
      await user.save()

      res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
      next(error)
    }
  }


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
    const { email, currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.',
      })
    }

    try {
      const user = await User.findById(email)
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' })
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password)
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
    const refreshToken = localStorage['refreshToken'] ? JSON.parse(localStorage['refreshToken']) : null;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh Token is required' });
    }
    try {
      const refreshPayload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY
      )
      const newAccessToken = tokenGenerator.generateAccessToken({ userId: refreshPayload.userId }, process.env.JWT_SECRET_KEY, process.env.JWT_EXPIRATION);
      const newRefreshToken = tokenGenerator.generateRefreshToken({ userId: refreshPayload.userId }, process.env.JWT_REFRESH_KEY, process.env.JWT_REFRESH_EXPIRATION);
      console.log(newAccessToken, newRefreshToken);
      return res.status(200).json({ message: 'New Access and Refresh Tokens generated successfully' })

    } catch (error) {
      return res.status(401).json({
        message: 'Session expired. Please login again.', error: error.message
      })
    }
  }
}