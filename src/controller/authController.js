import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

dotenv.config();

export default class AuthController {
  registerUser = async (req, res) => {
    try {

      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log(username, password, hashedPassword);
      const user = new User({ username, password: hashedPassword });
      await user.save();
      res.status(201).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, Error: error });
    }
  };
  loginUser = async (req, res, next) => {
    try {
      const secretKey = process.env.JWT_SECRET_KEY;
      const { username, password } = req.body;

      const user = await User.findOne({ username });

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

      delete user._doc.password;
      res.status(200).json({ token, user });
    } catch (error) {
      res.status(500).json({ error: `Login failed: ${error}` });
      next(error);
    }
  };

}