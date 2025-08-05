import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from '../config/config';
import { Product } from '../models/Product';
import productsData from './products.json'; // your array of 15 products

dotenv.config();

async function seedProducts() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(productsData);
    console.log(`Inserted ${productsData.length} products.`);

  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected after seeding');
    process.exit(0);
  }
}

seedProducts();
