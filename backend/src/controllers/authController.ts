import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as authService from '../services/authService';
import { User } from '../models/User';

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
    }
    
    if (!token) {
      return res.status(401).json({ isAuthenticated: false });
    }

    // Verify token and decode user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    
    // Fetch user from database
    const user = await User.findById(decoded.sub).select('-password');
    
    if (!user) {
      return res.status(401).json({ isAuthenticated: false });
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
    res.status(401).json({ isAuthenticated: false });
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