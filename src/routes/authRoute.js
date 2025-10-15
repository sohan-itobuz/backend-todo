import express from "express";
import AuthController from "../controller/authController.js";
import { sendOTP, verifyOTP } from "../controller/otpController.js";
import { validateUserSchema } from "../validation/userValidate.js";

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post('/sign-up', validateUserSchema, authController.registerUser);

authRouter.post('/login', validateUserSchema, authController.loginUser);

authRouter.post('/log-out', authController.logoutUser);

authRouter.post('/forget-password/send-otp', sendOTP);
authRouter.post('/forget-password/verify-otp', verifyOTP);
authRouter.post('/forget-password/reset', authController.setNewPasswordAfterOTP);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.post('/refresh-token', authController.refreshAccessToken);

export default authRouter;