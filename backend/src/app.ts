import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import cartRoutes from './routes/cartRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import paymentRoutes from './routes/paymentRoutes';
import contactRoutes from './routes/contactRoutes';

const app = express();

// Middlewares
const allowedOrigins = [
    'https://nextjs15-ecommerce-rvcc.vercel.app', // Vercel frontend
    'https://nextjs15-ecommerce-sooty.vercel.app',
    'http://localhost:3000', // local dev
    'http://localhost:3001' // local dev
  ];
  
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.options('/auth/login', (req, res) => {
    res.set({
      'Access-Control-Allow-Origin': 'https://nextjs15-ecommerce-sooty.vercel.app',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin'
    });
    res.status(204).end();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.use('/api/contact', contactRoutes);

app.use('/api/payment', paymentRoutes);

app.get('/health', (req, res) => {
    return res.json({message:'Backend Running...'})
})

// Global Error Handler
app.use(errorHandler);

export default app;
