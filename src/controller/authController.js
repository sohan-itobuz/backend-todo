import dotenv from "dotenv";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import User from "../models/user.js";
import tokenGenerator from "../services/tokenGenerator.js";

dotenv.config();

export const refreshTokens = [];

export default class AuthController {
  registerUser = async (req, res) => {
    try {

      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log(email, password, hashedPassword);
      const user = new User({ email, password: hashedPassword });
      await user.save();
      res.status(201).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, Error: error });
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

}