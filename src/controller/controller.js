// import fs from 'fs/promises'
// import path from 'path'
// import { fileURLToPath } from 'url'
import todo from '../models/todo.js'

export const getAllTasks = async (req, res) => {
  try {
    const { userId, search, category } = req.query
    // const db = await readDatabase()
    // let filteredTasks = db.tasks
    let query = {};

    if (search && category) {
      const searchTerm = search.trim()
      switch (category.toLowerCase()) {
        case 'name': {
          query = {
            $and: [
              {
                text: { $regex: searchTerm, $options: 'i' } // i for case insensitive search
              },
              { userId }
            ]
          }
          break;
        }
        case 'priority': {
          const searchPriority = parseInt(searchTerm)
          query =
          {
            $and: [
              {
                priority: { searchPriority }
              },
              { userId }
            ]
          }
          break;
        }
        case 'tags': {
          query = {
            $and: [
              {
                tags: { $in: [new RegExp(searchTerm, 'i')] }
              },
              { userId }
            ]
          }
          break;
        }
        case 'completed': {
          query = {
            $and: [
              {
                completed: { $eq: searchTerm.toLowerCase() === 'true' }
              }
            ]
          }
          break;
        }
        default:
          return true;
      }
    }

    const tasks = await todo.find(query).sort({ updatedAt: -1 })  //  .sort() implementation
    res.json(tasks)
  } catch (error) {
    console.error('Error reading database:', error)
    res.status(500).json({ error: 'Failed to fetch tasks', details: error.message })
  }
}

// export const getTaskById = async (req, res) => {
//   try {
//     const { id } = req.params
//     const task = await todo.findById(id)
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' })
//     }

//     res.json(task)
//   } catch (error) {
//     console.error('Error reading database:', error)
//     res.status(500).json({ error: 'Failed to fetch task' })
//   }
// }

export const createTask = async (req, res) => {
  try {
    const { userId, text, priority, completed, tags } = req.body
    const Todo = new todo({
      userId, text, priority, completed, tags
    })


    const newTask = await todo.create(Todo);

    res.status(201).json(newTask)
  } catch (error) {
    console.error('Error writing to database:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
}


export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTask = await todo.findByIdAndUpdate(id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json(updatedTask);
  } catch (error) {

    console.error('Error writing to database:', error)
    res.status(500).json({ error: 'Failed to update task', details: error.message })
  }
}


export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await todo.findByIdAndDelete(req.params.id)

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json({ success: true, message: 'Task deleted successfully', data: deletedTask })
  } catch (error) {
    console.error('Error writing to database:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
}


export const deleteAllTasks = async (req, res) => {
  try {
    const result = await todo.deleteMany({})

    res.json({ success: true, message: `All ${result.deletedCount} tasks deleted` })
  } catch (error) {
    console.error('Error writing to database:', error)
    res.status(500).json({ error: 'Failed to delete all tasks' })
  }
}
