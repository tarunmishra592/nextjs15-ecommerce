// scripts/seed.js
import 'dotenv/config.js';
import mongoose from 'mongoose';

// import your models, e.g.
// import Product from '../src/modules/products/products.model.js';

(async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🟢 Connected to MongoDB');

    // Example seed logic:
    // await Product.deleteMany({});
    // await Product.insertMany([{ name: 'Sample Product', price: 999 }]);

    console.log('✅ Seed complete');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
})();
