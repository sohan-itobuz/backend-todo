import Router from "express";
import verifyToken from "../middlewares/verifyTokenMiddleware.js";

const protectedRouter = new Router();

// Protected route
protectedRouter.get('/', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed' });
});
export default protectedRouter;