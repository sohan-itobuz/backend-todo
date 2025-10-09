// import fs from 'fs/promises'
// import path from 'path'
// import { fileURLToPath } from 'url'
import todo from '../models/todo.js'

export const getAllTasks = async (req, res) => {
  try {
    const { search, category } = req.query
    // const db = await readDatabase()
    // let filteredTasks = db.tasks
    const query = {};

    if (search && category) {
      const searchTerm = search.trim()
      switch (category.toLowerCase()) {
        case 'name':
          query.text = { $regex: searchTerm, $options: 'i' } //for case insensitive search
          break;
        case 'priority':
          {
            // const searchPriority = parseInt(searchTerm);
            // return !isNaN(searchPriority) && task.priority === searchPriority

            const searchPriority = parseInt(searchTerm)
            if (!isNaN(searchPriority)) {
              query.priority = searchPriority
            }
            break;
          }
        case 'tags':
          // return task.tags && Array.isArray(task.tags) && task.tags.some(tag => tag.toLowerCase().includes(searchTerm))

          query.tags = { $in: [new RegExp(searchTerm, 'i')] } // to search in an array, $in is a mongodb query operator, it created a js regular expression object
          break;

        default:
          return true;
      }
    }

    // const sortCriteria = {
    //   createdAt: -1,
    //   completed: 1,
    //   priority: -1,
    // }
    const tasks = await todo.find(query)   //  .sort() implementation
    res.json(tasks)
  } catch (error) {
    console.error('Error reading database:', error)
    res.status(500).json({ error: 'Failed to fetch tasks', details: error.message })
  }
}

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params
    const task = await todo.findById(id)
    // const db = await readDatabase()
    // const task = db.tasks.find((task) => task.id === id)

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json(task)
  } catch (error) {
    console.error('Error reading database:', error)
    res.status(500).json({ error: 'Failed to fetch task' })
  }
}

export const createTask = async (req, res) => {
  try {
    // const { text, priority, completed, tags } = req.body

    // if (!text || !text.trim()) {
    //   return res.status(400).json({ error: 'Task text is required' }) // no need as already added validation
    // }

    // const taskTags = Array.isArray(tags) ? tags : [];

    const newTask = await todo.create(req.body);

    // const db = await readDatabase()
    // db.tasks.push(newTask)
    // await writeDatabase(db)

    res.status(201).json(newTask)
  } catch (error) {
    console.error('Error writing to database:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
}


export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // const { text, priority, completed, tags } = req.body
    // const db = await readDatabase()
    // const taskIndex = db.tasks.findIndex((task) => task.id === id)

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


    // if (text !== undefined) db.tasks[taskIndex].text = text.trim()
    // if (priority !== undefined) db.tasks[taskIndex].priority = priority
    // if (completed !== undefined) db.tasks[taskIndex].completed = completed
    // if (tags !== undefined) db.tasks[taskIndex].tags = Array.isArray(tags) ? tags : [];
    // db.tasks[taskIndex].updatedAt = new Date().toISOString();
    // await writeDatabase(db)

    res.json(updatedTask);
  } catch (error) {
    console.error('Error writing to database:', error)
    res.status(500).json({ error: 'Failed to update task', details: error.message })
  }
}


export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await todo.findByIdAndDelete(req.params.id)
    // const db = await readDatabase()
    // const taskIndex = db.tasks.findIndex((task) => task.id === id)

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' })
    }

    // db.tasks.splice(taskIndex, 1)
    // await writeDatabase(db)

    res.json({ message: 'Task deleted successfully', data: deletedTask })
  } catch (error) {
    console.error('Error writing to database:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
}


export const deleteAllTasks = async (req, res) => {
  try {
    // const db = await readDatabase()
    // db.tasks = []
    // await writeDatabase(db)

    const result = await todo.deleteMany({})

    res.json({ message: `All ${result.deletedCount} tasks deleted` })
  } catch (error) {
    console.error('Error writing to database:', error)
    res.status(500).json({ error: 'Failed to delete all tasks' })
  }
}
