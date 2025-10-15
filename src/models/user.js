import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  todos: { type: mongoose.Types.ObjectId, ref: 'Todo' },
});

const user = mongoose.model('User', userSchema);
export default user;