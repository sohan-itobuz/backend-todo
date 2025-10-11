
import express from 'express'
import cors from 'cors'
import router from './routes/routes.js'
import connectDB from './database/db.js'

import authRoutes from './routes/authRoute.js'
import protectedRoute from './routes/protectedRoute.js'
import loggerMiddleware from './middlewares/logger.js'


connectDB();

const app = express()
const PORT = process.env.PORT || 3001


app.use(cors())
app.use(express.json())

app.use(loggerMiddleware);

app.use('/api/todos', router)
app.use('/api/auth', authRoutes)
app.use('/api/protected', protectedRoute)

app.get('/', (req, res) => {
  res.json({
    message: 'To-Do List API Server is running!'
  })
})


app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' })
})


app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  })
})


// Error handling middleware
//eslint-disable-next-line
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`API endpoints available at http://localhost:${PORT}/api/todos`)
})
