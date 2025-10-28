import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },

    title: {
      type: String,
      required: [true, 'Please add a task description'],
      trim: true,
      minlength: [1, 'Task text cannot be empty'],
    },

    priority: {
      type: Number,
      default: 2,
      min: 1,
      max: 3,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    tags: {
      type: [String],
      default: [],
    },

    attachment: {
      type: String,
      default: null,
    },

  },
  {
    timestamps: true,
  }
);

const todo = mongoose.model('todo', todoSchema);
export default todo;