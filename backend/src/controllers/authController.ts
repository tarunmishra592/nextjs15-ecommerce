import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

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
