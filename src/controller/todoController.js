// import fs from 'fs/promises'
// import path from 'path'
// import { fileURLToPath } from 'url'
import todo from '../models/todo.js'

export const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    // console.log(userId);
    const { search, category } = req.query;

    let query = { userId };

    if (search && category) {
      const searchTerm = search;
      switch (category.toLowerCase()) {
        case 'name': {
          query = {
            $and: [
              {
                title: { $regex: searchTerm, $options: 'i' } // i for case insensitive search
              },
              { userId }
            ]
          }
          break;
        }
        case 'priority': {
          const searchPriority = parseInt(searchTerm);

          if (!isNaN(searchPriority)) {
            query = {
              $and: [
                {
                  priority: searchPriority
                },
                { userId }
              ]
            };
          } else {
            query = { userId, priority: null };
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
              },
              { userId }
            ]
          }
          break;
        }
        default:
          break;
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

    const userId = req.user.userId;
    console.log(userId);
    const newTask = new todo({ userId, ...req.body });
    await newTask.save();

    res.status(201).send({ success: true, newTask });

  } catch (error) {
    console.error('Error writing to database:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
}


export const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    const updatedTask = await todo.findByIdAndUpdate({ _id: id, userId },
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
    const deletedTask = await todo.findByIdAndDelete({ _id: req.params.id, userId: req.user.userId });

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
    const userId = req.user.userId;
    const result = await todo.deleteMany({ userId });

    res.json({ success: true, message: `All ${result.deletedCount} tasks deleted` })
  } catch (error) {
    console.error('Error writing to database:', error)
    res.status(500).json({ error: 'Failed to delete all tasks' })
  }
}
