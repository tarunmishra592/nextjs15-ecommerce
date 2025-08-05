import { Request, Response, NextFunction } from 'express';
import * as wishlistService from '../services/wishlistService';

export const getWishlist = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await wishlistService.getWishlist(_req.user!.sub);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const addWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const updated = await wishlistService.addToWishlist(req.user!.sub, productId);
    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const updated = await wishlistService.removeFromWishlist(req.user!.sub, productId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
