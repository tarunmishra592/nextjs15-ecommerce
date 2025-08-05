import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cartService';

export const getCart = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.getCart(_req.user!.sub);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const addCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity } = req.body;
    const updated = await cartService.addToCart(req.user!.sub, productId, quantity);
    res.status(updated.some((i) => i.product.toString() === productId) ? 200 : 201).json(updated);
  } catch (err) {
    next(err);
  }
};

export const updateCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    const updated = await cartService.updateCartItem(req.user!.sub, productId, quantity);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const updated = await cartService.removeCartItem(req.user!.sub, productId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
