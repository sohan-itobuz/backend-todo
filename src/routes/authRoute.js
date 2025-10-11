import express from "express";
import AuthController from "../controller/authController.js";


const authRouter = express.Router();
const authController = new AuthController();

authRouter.post('/sign-up', authController.registerUser);

authRouter.post('/login', authController.loginUser);

export default authRouter;