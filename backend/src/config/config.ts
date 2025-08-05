import path from 'path';
import dotenv from 'dotenv';

// Load .env as early as possible
dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface Config {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  RAZORPAY_KEY_ID: string
  RAZORPAY_KEY_SECRET: string;
}

const required = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'PORT',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_KEY_ID'
] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export const config: Config = {
  NODE_ENV: process.env.NODE_ENV as Config['NODE_ENV'] || 'development',
  PORT: parseInt(process.env.PORT as string, 10),
  MONGODB_URI: process.env.MONGODB_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID as string,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET as string,
};
