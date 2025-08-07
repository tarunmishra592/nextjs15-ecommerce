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
    const isVercel = process.env.VERCEL === '1';
    const frontendDomain = isVercel ? process.env.FRONTEND_URL : 'localhost';

    res.cookie('token', data.token, {
      httpOnly: true,
      secure: true, // Must be true on Vercel
      sameSite: 'none', // Required for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
      domain: isVercel ? `.${frontendDomain}` : frontendDomain
    });
    res.status(200).json({ token: data.token, user: data.user});
  } catch (err) {
    next(err);
  }
};
