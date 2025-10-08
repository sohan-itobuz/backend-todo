import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, '../../database/db.json')

// function to read from database
const readDatabase = async () => {
  try {
    const data = await fs.readFile(dbPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeDatabase({ tasks: [] })
      return { tasks: [] }
    }
    throw error
  }
}

// function to write to database
const writeDatabase = async (data) => {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2))
}

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const { search, category } = req.query
    const db = await readDatabase()
    let filteredTasks = db.tasks

    if (search && category) {
      const searchTerm = search.toLowerCase().trim()

      filteredTasks = db.tasks.filter(task => {
        switch (category) {
          case 'name':
            return task.text.toLowerCase().includes(searchTerm)
          case 'priority':
            {
              const searchPriority = parseInt(searchTerm);
              return !isNaN(searchPriority) && task.priority === searchPriority
            }
          case 'tags':
            return task.tags && Array.isArray(task.tags) && task.tags.some(tag => tag.toLowerCase().includes(searchTerm))
          default:
            return true
        }
      })
    }

    res.json(filteredTasks)
  } catch (error) {
    console.error('Error reading database:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
}

// Get task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params
    const db = await readDatabase()
    const task = db.tasks.find((task) => task.id === id)

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json(task)
  } catch (error) {
    console.error('Error reading database:', error)
    res.status(500).json({ error: 'Failed to fetch task' })
  }
}

// Create new task
export const createTask = async (req, res) => {
  try {
    const { text, priority, tags } = req.body

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Task text is required' })
    }
    const taskTags = Array.isArray(tags) ? tags : [];

    const newTask = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      text: text.trim(),
      priority: priority || 2,
      completed: false,
      tags: taskTags,
      createdAt: new Date().toISOString(),
    }

    const db = await readDatabase()
    db.tasks.push(newTask)
    await writeDatabase(db)

    res.status(201).json(newTask)
  } catch (error) {
    console.error('Error writing to database:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
}

// Update task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const { text, priority, completed, tags } = req.body

    const db = await readDatabase()
    const taskIndex = db.tasks.findIndex((task) => task.id === id)

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' })
    }

    // Update task fields
    if (text !== undefined) db.tasks[taskIndex].text = text.trim()
    if (priority !== undefined) db.tasks[taskIndex].priority = priority
    if (completed !== undefined) db.tasks[taskIndex].completed = completed

    if (tags !== undefined) db.tasks[taskIndex].tags = Array.isArray(tags) ? tags : [];

    db.tasks[taskIndex].updatedAt = new Date().toISOString();

    await writeDatabase(db)
    res.json(db.tasks[taskIndex])
  } catch (error) {
    console.error('Error writing to database:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
}

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params
    const db = await readDatabase()
    const taskIndex = db.tasks.findIndex((task) => task.id === id)

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' })
    }

    db.tasks.splice(taskIndex, 1)
    await writeDatabase(db)

    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error writing to database:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
}

// Delete all tasks
export const deleteAllTasks = async (req, res) => {
  try {
    const db = await readDatabase()
    db.tasks = []
    await writeDatabase(db)

    res.json({ message: 'All tasks deleted successfully' })
  } catch (error) {
    console.error('Error writing to database:', error)
    res.status(500).json({ error: 'Failed to delete all tasks' })
  }
}
