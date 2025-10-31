import mongoose from 'mongoose';
import env from './env.js';
const { MONGO_URI } = env;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(1);
  }
};
