import express from 'express'
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
} from '../controller/controller.js'

const router = express.Router()

// GET all tasks
router.get('/', getAllTasks)

// GET task by ID
router.get('/:id', getTaskById)

// CREATE new task
router.post('/', createTask)

// UPDATE task
router.put('/:id', updateTask)

// DELETE task
router.delete('/:id', deleteTask)

// DELETE all tasks
router.delete('/', deleteAllTasks)

export default router
