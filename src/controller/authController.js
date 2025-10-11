import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

dotenv.config();

const refreshTokens = [];

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
      const secretKey = process.env.JWT_SECRET_KEY;
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Password not matched' });
      }

      const token = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: process.env.JWT_EXPIRATION,
      });

      const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_KEY, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      });

      refreshTokens.push(refreshToken);

      delete user._doc.password;
      res.status(200).json({ success: true, token, user });
    } catch (error) {
      res.status(500).json({ error: `Login failed: ${error}` });
      next(error);
    }
  };

}