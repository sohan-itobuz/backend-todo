import Router from "express";

import { sendOTP, verifyOTP } from "../controller/otpController.js";

const otpRouter = new Router();

otpRouter.post('/send-otp', sendOTP);
otpRouter.post('/verify-otp', verifyOTP);

export default otpRouter;