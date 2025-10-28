
import express from 'express'
import cors from 'cors'
import router from './routes/routes.js'
import connectDB from './database/db.js'

import authRoutes from './routes/authRoute.js'
import protectedRoute from './routes/protectedRoute.js'
import loggerMiddleware from './middlewares/logger.js'
import otpRouter from './routes/otpRoutes.js'
import errorHandler from './middlewares/errorHandler.js'
import verifyToken from './middlewares/verifyAccessTokenMiddleware.js'
import profileRouter from './routes/profileRoute.js'

import { env } from './config/envConfig.js';

connectDB();

const app = express()
const PORT = env.PORT;


app.use(cors())
app.use(express.json())

app.use(loggerMiddleware);

app.use('/todos', verifyToken, router)
app.use('/user/profile', verifyToken, profileRouter);
app.use('/user/auth', authRoutes, otpRouter)
app.use('/user/auth/protected', protectedRoute)
app.use('/imageDatabase/userUploads', express.static('imageDatabase/userUploads'));

app.get('/', (req, res) => {
  res.json({
    message: 'To-Do List API Server is running!'
  })
})

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  })
})

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`API endpoints available at http://localhost:${PORT}/todos`)
})
