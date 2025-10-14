import Router from "express";

import { sendOTP, verifyOTP } from "../controller/otpController.js";
import isVerified from "../middlewares/isVerifiedCheck.js";

const otpRouter = new Router();

otpRouter.post('/send-otp', isVerified, sendOTP);
otpRouter.post('/verify-otp', verifyOTP);

export default otpRouter;