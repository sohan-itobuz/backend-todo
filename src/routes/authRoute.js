import express from "express";
import AuthController from "../controller/authController.js";
import { sendOTP, verifyOTP } from "../controller/otpController.js";


const authRouter = express.Router();
const authController = new AuthController();

authRouter.post('/sign-up', authController.registerUser);

authRouter.post('/login', authController.loginUser);

authRouter.post('/log-out', authController.logoutUser);

authRouter.post('/forgot-password/send-otp', sendOTP);
authRouter.post('/forgot-password/verify-otp', verifyOTP);
authRouter.post('/forgot-password/reset', authController.setNewPasswordAfterOTP);
authRouter.post('/reset-password', authController.resetPassword);


export default authRouter;