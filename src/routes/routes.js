import express from 'express'
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
} from '../controller/controller.js'
// import todo from '../models/todo.js'

import { validateCreateTodo, validateUpdateTodo } from '../validation/validate.js'

const router = express.Router()

// GET all tasks
router.get('/', getAllTasks)

// GET task by ID
router.get('/:id', getTaskById)

// CREATE new task
router.post('/', validateCreateTodo, createTask)

// UPDATE task
router.put('/:id', validateUpdateTodo, updateTask)

// DELETE task
router.delete('/:id', deleteTask)

// DELETE all tasks
router.delete('/', deleteAllTasks)

export default router
