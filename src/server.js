
import express from 'express'
import cors from 'cors'
import todoRoutes from './routes/routes.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/todos', todoRoutes)

// Root route to avoid 404
app.get('/', (req, res) => {
  res.json({
    message: 'To-Do List API Server is running!',
    endpoints: {
      getAllTasks: 'GET /api/todos?search={term}&category={name|priority|tags}',
      createTask: 'POST /api/todos',
      updateTask: 'PUT /api/todos/:id',
      deleteTask: 'DELETE /api/todos/:id',
      deleteAllTasks: 'DELETE /api/todos',
    },
  })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' })
})

// Handle 404 for undefined routes 
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: {
      root: 'GET /',
      health: 'GET /api/health',
      todos: {
        getAll: 'GET /api/todos',
        create: 'POST /api/todos',
        update: 'PUT /api/todos/:id',
        delete: 'DELETE /api/todos/:id',
        deleteAll: 'DELETE /api/todos',
      },
    },
  })
})

// Error handling middleware
app.use((err, req, res, /* next */) => {
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
