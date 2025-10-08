import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    text: {
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id; // Map Mongoose's _id to 'id' 
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  }
);

const todo = mongoose.model('todo', todoSchema);
export default todo;