import mongoose from 'mongoose';
import logger from '../utils/logger';
import { config } from './config';

export async function connectDB(): Promise<void> {
  try {
    const uri = config.MONGODB_URI;
    await mongoose.connect(uri, {
      // recommended options (mongoose 7+ defaults are fine)
      // use new topology engine, etc.
      // adjust `serverSelectionTimeoutMS` as needed
    });
    logger.info('🗄️ MongoDB connected');

    
    // Connection event listeners
    mongoose.connection.on('error', err => {
      logger.error('MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
  } catch (error) {
    logger.error('Failed to connect MongoDB', error);
    process.exit(1);
  }
}