import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.user!.sub);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await userService.updateProfile(req.user!.sub, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.changePassword(req.user!.sub, req.body.currentPassword, req.body.newPassword);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await userService.addAddress(req.user!.sub, req.body);
    res.status(201).json(address);
  } catch (err) {
    next(err);
  }
};

export const listAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addresses = await userService.listAddresses(req.user!.sub);
    res.json(addresses);
  } catch (err) {
    next(err);
  }
};
