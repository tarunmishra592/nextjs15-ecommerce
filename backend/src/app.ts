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
    'http://localhost:3000',
    'https://your-frontend.vercel.app',
  ];
  
app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

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
