import Router from "express";
import verifyToken from "../middlewares/verifyAccessTokenMiddleware.js";
import AuthController from "../controller/authController.js";

const authController = new AuthController();
const protectedRouter = new Router();

// Protected route
protectedRouter.get('/', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed' });
});
protectedRouter.post('/refresh-token', authController.refreshAccessToken);

export default protectedRouter;