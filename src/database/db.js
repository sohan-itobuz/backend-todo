import mongoose from 'mongoose'
import { env } from '../config/envConfig';

//for mongodb 
const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      dbName: 'test',
    });
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}
export default connectDB;