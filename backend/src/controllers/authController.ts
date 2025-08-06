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

    res.header('Access-Control-Allow-Origin', 'https://nextjs15-ecommerce-sooty.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');

    res.cookie('token', data.token, {
      httpOnly: true,
      secure: true, // Must be true for sameSite: 'none'
      sameSite: 'none', // Required for cross-origin
      domain: '.vercel.app', // Cover all subdomains
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.status(200).json({ token: data.token, user: data.user});
  } catch (err) {
    next(err);
  }
};
