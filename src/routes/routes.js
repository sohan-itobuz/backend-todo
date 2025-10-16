import express from 'express'
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
} from '../controller/controller.js'
// import todo from '../models/todo.js'

import { validateCreateTodo, validateUpdateTodo } from '../validation/todoValidate.js'
import AuthController from '../controller/authController.js';

const router = express.Router()
const authController = new AuthController();

// GET all tasks
router.get('/', getAllTasks)

// // GET task by ID
// router.get('/:id', getTaskById)

// CREATE new task
router.post('/', validateCreateTodo, createTask)

// UPDATE task
router.put('/:id', validateUpdateTodo, updateTask)

// DELETE task
router.delete('/:id', deleteTask)

// DELETE all tasks
router.delete('/', deleteAllTasks)

//reset password
router.post('/reset-password', authController.resetPassword);
export default router
