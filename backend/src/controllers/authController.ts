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
    // Get the requesting origin dynamically
    const requestOrigin = req.get('origin') || '';
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie('token', data.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      // Use the specific domain instead of .vercel.app
      domain: isProduction 
        ? new URL(requestOrigin).hostname // e.g. "nextjs15-ecommerce-sooty.vercel.app"
        : 'localhost',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({ token: data.token, user: data.user});
  } catch (err) {
    next(err);
  }
};
