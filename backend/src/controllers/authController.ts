import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import * as authService from '../services/authService';
import { User } from '../models/User';
import { sendPasswordResetEmail } from '../utils/email';

const SALT_ROUNDS = 10;


export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const token = await authService.signup(name, email, password);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);

    // Set HTTP-only cookie (secure, same-site)
    res.cookie('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // or 'strict' for better CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      path: '/',
      domain: process.env.NODE_ENV === 'production' 
        ? '.vercel.app' // Important for subdomains
        : undefined // localhost
    });

    // Still return token in response for client-side storage (if needed)
    res.status(200).json({ 
      token: data.token, 
      user: data.user 
    });

  } catch (err) {
    next(err);
  }
};



export const verifyAuth = async (req: Request, res: Response) => {
  try {
    let token = req.cookies.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('auth token', token)
    }
    
    if (!token) {
      return res.status(400).json({ isAuthenticated: false });
    }

    // Verify token and decode user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    
    // Fetch user from database
    const user = await User.findById(decoded.sub).select('-password');
    
    if (!user) {
      return res.status(400).json({ isAuthenticated: false });
    }

    res.status(200).json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        // Add other safe fields
      }
    });

  } catch (err) {
    res.status(400).json({ isAuthenticated: false });
  }
};


export const logout = (req: Request, res: Response) => {
  res.cookie('token', '', {
    expires: new Date(0),
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId: any = req.user?.sub; // Assuming you have authentication middleware

    const user = await authService.changePasswordService(
      userId,
      currentPassword,
      newPassword
    );

    // Optionally clear token cookie if you want to force re-login
    res.clearCookie('token');

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      user: user
    });

  } catch (err) {
    next(err);
  }
};



export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    // 1. Check if user exists (pseudo-code)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Send email with JWT token (no DB storage)
    await sendPasswordResetEmail(email, user._id);

    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    // 1. Verify JWT and check purpose
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as any);
    console.log('decoded', decoded)
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // 2. Update user password (pseudo-code)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashed; // Hash password in production!
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};